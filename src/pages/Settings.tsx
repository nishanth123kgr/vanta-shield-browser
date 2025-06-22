import { Shield, Settings as SettingsIcon, Save, RotateCcw, Bell, Globe, Lock, Eye, Database, Info, ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

// Extend the existing chrome API declaration
interface ExtendedChrome {
  runtime: {
    sendMessage: (message: any, callback?: (response: any) => void) => void;
  };
  storage?: {
    local: {
      get: (keys: string | string[] | null, callback: (result: any) => void) => void;
      set: (items: any, callback?: () => void) => void;
    };
  };
}

interface SettingsData {
  realTimeProtection: boolean;
  blockMaliciousDownloads: boolean;
  enableNotifications: boolean;
  strictMode: boolean;
  autoWhitelist: boolean;
  collectAnalytics: boolean;
  debugMode: boolean;
}

interface WhitelistedDomain {
  hash: string;
  domain: string;
  key: string;
}

const Settings = () => {
  // Use global chrome object
  const chromeAPI = (window as any).chrome || window.chrome as ExtendedChrome;
  
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [whitelistedDomains, setWhitelistedDomains] = useState<WhitelistedDomain[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const engineVersion = "1.0";

  // Default settings
  const defaultSettings: SettingsData = {
    realTimeProtection: true,
    blockMaliciousDownloads: true,
    enableNotifications: true,
    strictMode: false,
    autoWhitelist: false,
    collectAnalytics: true,
    debugMode: false,
  };

  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  useEffect(() => {
    // Load settings from Chrome storage or localStorage
    loadSettings();
    loadWhitelistedDomains();
  }, []);

  const loadSettings = () => {
    try {
      if (chromeAPI && chromeAPI.storage && chromeAPI.storage.local) {
        chromeAPI.storage.local.get(['vantaSettings'], (result) => {
          if (result.vantaSettings) {
            setSettings({ ...defaultSettings, ...result.vantaSettings });
          }
        });
      } else {
        // Fallback to localStorage
        const savedSettings = localStorage.getItem('vantaSettings');
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadWhitelistedDomains = () => {
    console.log('Loading whitelisted domains...');
    try {
      if (chromeAPI && chromeAPI.runtime && chromeAPI.runtime.sendMessage) {
        console.log('Using Chrome API to get whitelisted domains');
        chromeAPI.runtime.sendMessage({ type: 'getWhitelistedDomains' }, (response) => {
          console.log('Received response from background script:', response);
          if (response && response.domains) {
            console.log('Setting whitelisted domains:', response.domains);
            setWhitelistedDomains(response.domains);
          } else {
            console.log('No domains in response or invalid response');
            setWhitelistedDomains([]);
          }
        });
      } else {
        console.log('Chrome API not available, using localStorage fallback');
        // Fallback to localStorage
        const domains: WhitelistedDomain[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('vanta_') && 
              !key.startsWith('vanta_cache_') && 
              !key.startsWith('vanta_blocked_') &&
              !key.startsWith('vanta_engine_') &&
              key !== 'vantaSettings') {
            const value = localStorage.getItem(key);
            console.log(`Found localStorage key: ${key} = ${value}`);
            if (value && value !== '0') {
              domains.push({
                hash: key.replace('vanta_', ''),
                domain: value,
                key: key
              });
            }
          }
        }
        console.log('Setting domains from localStorage:', domains);
        setWhitelistedDomains(domains);
      }
    } catch (error) {
      console.error('Error loading whitelisted domains:', error);
    }
  };

  const addDomain = () => {
    if (!newDomain.trim()) return;
    
    setIsAddingDomain(true);
    
    // Normalize domain (remove protocol, www, etc.)
    let cleanDomain = newDomain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    cleanDomain = cleanDomain.replace(/^www\./, '');
    cleanDomain = cleanDomain.split('/')[0]; // Remove path
    
    try {
      if (chromeAPI && chromeAPI.runtime && chromeAPI.runtime.sendMessage) {
        chromeAPI.runtime.sendMessage({ 
          type: 'addToWhitelist', 
          domain: cleanDomain 
        }, (response) => {
          if (response && response.success) {
            loadWhitelistedDomains(); // Reload the list
            setNewDomain("");
            toast({
              title: "Domain Added",
              description: `${cleanDomain} has been added to your whitelist.`,
              variant: "default",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to add domain to whitelist.",
              variant: "destructive",
            });
          }
          setIsAddingDomain(false);
        });
      } else {
        // Fallback to localStorage
        const CryptoJS = (window as any).CryptoJS;
        if (CryptoJS) {
          const hashHex = CryptoJS.SHA256(cleanDomain).toString(CryptoJS.enc.Hex);
          const key = `vanta_${hashHex}`;
          localStorage.setItem(key, cleanDomain);
          loadWhitelistedDomains(); // Reload the list
          setNewDomain("");
          toast({
            title: "Domain Added",
            description: `${cleanDomain} has been added to your whitelist.`,
            variant: "default",
          });
        }
        setIsAddingDomain(false);
      }
    } catch (error) {
      console.error('Error adding domain:', error);
      toast({
        title: "Error",
        description: "Failed to add domain to whitelist.",
        variant: "destructive",
      });
      setIsAddingDomain(false);
    }
  };

  const removeDomain = (domainToRemove: WhitelistedDomain) => {
    try {
      if (chromeAPI && chromeAPI.runtime && chromeAPI.runtime.sendMessage) {
        chromeAPI.runtime.sendMessage({ 
          type: 'removeFromWhitelist', 
          key: domainToRemove.key 
        }, (response) => {
          if (response && response.success) {
            loadWhitelistedDomains(); // Reload the list
            toast({
              title: "Domain Removed",
              description: `${domainToRemove.domain} has been removed from your whitelist.`,
              variant: "default",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to remove domain from whitelist.",
              variant: "destructive",
            });
          }
        });
      } else {
        // Fallback to localStorage
        localStorage.removeItem(domainToRemove.key);
        loadWhitelistedDomains(); // Reload the list
        toast({
          title: "Domain Removed",
          description: `${domainToRemove.domain} has been removed from your whitelist.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error removing domain:', error);
      toast({
        title: "Error",
        description: "Failed to remove domain from whitelist.",
        variant: "destructive",
      });
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setIsAnimating(true);

    try {
      if (chromeAPI && chromeAPI.storage && chromeAPI.storage.local) {
        chromeAPI.storage.local.set({ vantaSettings: settings }, () => {
          console.log('Settings saved to Chrome storage');
        });
      } else {
        // Fallback to localStorage
        localStorage.setItem('vantaSettings', JSON.stringify(settings));
        console.log('Settings saved to localStorage');
      }

      setTimeout(() => {
        toast({
          title: "Settings Saved",
          description: "Your preferences have been updated successfully.",
          variant: "default",
        });
        setIsSaving(false);
        setIsAnimating(false);
      }, 500);
    } catch (error) {
      console.error('Error saving settings:', error);
      setTimeout(() => {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
        setIsSaving(false);
        setIsAnimating(false);
      }, 500);
    }
  };

  const resetSettings = () => {
    setIsAnimating(true);
    setSettings(defaultSettings);
    
    setTimeout(() => {
      toast({
        title: "Settings Reset",
        description: "All settings have been restored to defaults.",
        variant: "default",
      });
      setIsAnimating(false);
    }, 300);
  };

  const handleSettingChange = (key: keyof SettingsData, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGoBack = () => {
    // Check if we're in a browser environment with React Router
    try {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // If standalone, close the window or redirect to main page
        window.close();
      }
    } catch {
      window.close();
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-10">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Tagline in bottom right */}
      <div className="absolute bottom-4 right-4 text-white/30 text-sm font-mono z-10">
        // SECURING TOMORROW TODAY
      </div>

      {/* Version/Status in top left */}
      <div className="absolute top-4 left-4 text-white/30 text-sm font-mono flex items-center gap-2 z-10">
        <span>// HALONEX VANTA v{engineVersion}</span>
      </div>

      {/* Back button in top right */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={handleGoBack}
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Main container */}
      <div className={`relative w-full max-w-4xl mx-auto transition-all duration-300 z-10 ${isAnimating ? 'scale-[0.98] opacity-90' : 'scale-100 opacity-100'}`}>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Vanta Logo - Top on mobile, Right Side on desktop */}
          <div className="flex w-full lg:w-full items-center justify-center lg:order-3">
            <div className="relative">
              <img 
                src="/vanta-logo.png" 
                alt="Halonex Vanta" 
                className="w-48 lg:w-64 h-auto filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Settings Cards - Main content area */}
          <div className="lg:col-span-2 lg:order-1 w-full space-y-6">
            
            {/* Header Card */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/40 backdrop-blur-sm border-2 border-blue-500/60 p-2 rounded-full">
                    <SettingsIcon className="h-6 w-6 text-blue-300" strokeWidth={2} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">Settings</CardTitle>
                    <p className="text-white/70 text-sm">Configure your Halonex Vanta protection</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Protection Settings */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-lg font-semibold text-white">Protection Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white/90 font-medium">Real-time Protection</Label>
                    <p className="text-sm text-white/60">Continuously monitor and block threats</p>
                  </div>
                  <Switch
                    checked={settings.realTimeProtection}
                    onCheckedChange={(value) => handleSettingChange('realTimeProtection', value)}
                  />
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white/90 font-medium">Block Malicious Downloads</Label>
                    <p className="text-sm text-white/60">Prevent downloading harmful files</p>
                  </div>
                  <Switch
                    checked={settings.blockMaliciousDownloads}
                    onCheckedChange={(value) => handleSettingChange('blockMaliciousDownloads', value)}
                  />
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white/90 font-medium">Strict Mode</Label>
                    <p className="text-sm text-white/60">Enhanced security with stricter filtering</p>
                  </div>
                  <Switch
                    checked={settings.strictMode}
                    onCheckedChange={(value) => handleSettingChange('strictMode', value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* User Experience */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-lg font-semibold text-white">User Experience</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white/90 font-medium">Enable Notifications</Label>
                    <p className="text-sm text-white/60">Show alerts when threats are blocked</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(value) => handleSettingChange('enableNotifications', value)}
                  />
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white/90 font-medium">Auto-Whitelist Trusted Sites</Label>
                    <p className="text-sm text-white/60">Automatically allow frequently visited safe sites</p>
                  </div>
                  <Switch
                    checked={settings.autoWhitelist}
                    onCheckedChange={(value) => handleSettingChange('autoWhitelist', value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Whitelist Management */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-400" />
                  <CardTitle className="text-lg font-semibold text-white">Whitelisted Sites</CardTitle>
                </div>
                <p className="text-sm text-white/60">Manage trusted domains that will never be blocked</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add new domain */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter domain (e.g., example.com)"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addDomain()}
                    className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button
                    onClick={addDomain}
                    disabled={isAddingDomain || !newDomain.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Separator className="bg-white/10" />
                
                {/* List of whitelisted domains */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {whitelistedDomains.length === 0 ? (
                    <div className="text-center py-8 text-white/60">
                      <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No whitelisted domains yet</p>
                      <p className="text-sm">Add trusted sites to skip security checks</p>
                    </div>
                  ) : (
                    whitelistedDomains.map((domain) => (
                      <div key={domain.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-white font-medium">{domain.domain}</span>
                        </div>
                        <Button
                          onClick={() => removeDomain(domain)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-lg font-semibold text-white">Privacy & Data</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white/90 font-medium">Collect Analytics</Label>
                    <p className="text-sm text-white/60">Help improve Halonex Vanta with usage data</p>
                  </div>
                  <Switch
                    checked={settings.collectAnalytics}
                    onCheckedChange={(value) => handleSettingChange('collectAnalytics', value)}
                  />
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white/90 font-medium">Debug Mode</Label>
                    <p className="text-sm text-white/60">Enable detailed logging for troubleshooting</p>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(value) => handleSettingChange('debugMode', value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={saveSettings}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>

              <Button
                onClick={resetSettings}
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white/90 text-sm font-semibold">
                    Powered by <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Halonex Labs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
