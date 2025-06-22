// Declare chrome API for TypeScript
declare global {
  interface Window {
    chrome: {
      runtime: {
        sendMessage: (message: any, callback?: (response: any) => void) => void;
      };
    };
  }
}

// Use global chrome object
const chromeAPI = (window as any).chrome || window.chrome;

import { Shield, AlertTriangle, ArrowLeft, Globe, Lock, Plus, Info, ExternalLink, Clock, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";
import CryptoJS from "crypto-js";

const Index = () => {
  const { toast } = useToast();
  const [threatDetails, setThreatDetails] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [blockTime, setBlockTime] = useState("Just now");
  const [scanProgress, setScanProgress] = useState(0);
  const [blockedAttempts, setBlockedAttempts] = useState(247);
  const engineVersion = "1.0";
  
  // Get domain from URL parameters
  const [domain, setDomain] = useState("suspicious-banking-site.com"); // fallback domain
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlDomain = urlParams.get('domain');
    if (urlDomain) {
      setDomain(urlDomain);
    }
  }, []);

  useEffect(() => {
    // Set animation state on initial load
    setIsAnimating(true);

    // Simulate scanning progress
    const progressTimer = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Reset animation after animation completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 400);

    // Simulate blocked attempts counter
    const blockedTimer = setInterval(() => {
      setBlockedAttempts(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
      clearInterval(blockedTimer);
    };
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleOpenSettings = () => {
    // Check if we're in an extension context
    if (chromeAPI && chromeAPI.runtime) {
      // Open settings page in new tab for extension
      chromeAPI.runtime.sendMessage({
        type: 'openSettings'
      });
    } else {
      // For regular web app, try to navigate to settings
      window.location.href = '/settings-standalone.html';
    }
  };

  const handleVisitSafe = () => {
    window.open('https://halonex.com', '_blank');
  };

  const handleReportSafe = () => {
    toast({
      title: "Site Reported as Safe",
      description: "Thanks for your feedback. Our team will review this site.",
      variant: "default",
    });
  };

  const handleAddToWhitelist = () => {
    setIsAnimating(true);
    
    try {
      // Check if Chrome extension API is available
      if (chromeAPI && chromeAPI.runtime && chromeAPI.runtime.sendMessage) {
        chromeAPI.runtime.sendMessage({ 
          type: "addToWhitelist", 
          domain: domain 
        }, (response) => {
          if (response && response.success) {
            console.log(`Added to whitelist via Chrome extension: ${domain}`);
            toast({
              title: "Added to Whitelist",
              description: `${domain} has been added to your whitelist.`,
              variant: "default",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to add site to whitelist.",
              variant: "destructive",
            });
          }
          setIsAnimating(false);
        });
      } else {
        // Fallback to localStorage with hash
        const hashHex = CryptoJS.SHA256(domain).toString(CryptoJS.enc.Hex);
        const key = `vanta_${hashHex}`;
        localStorage.setItem(key, domain);
        console.log(`Added to whitelist via localStorage: ${key} = ${domain}`);
        
        setTimeout(() => {
          toast({
            title: "Added to Whitelist",
            description: `${domain} has been added to your whitelist.`,
            variant: "default",
          });
          setIsAnimating(false);
        }, 300);
      }
    } catch (error) {
      console.error('Error adding to whitelist:', error);
      setTimeout(() => {
        toast({
          title: "Error",
          description: "Failed to add site to whitelist.",
          variant: "destructive",
        });
        setIsAnimating(false);
      }, 300);
    }
  };

  // Simulate time of blocking
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockTime("Just now");
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-3">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Tagline in bottom right */}
      <div className="absolute bottom-4 right-4 text-white/30 text-sm font-mono z-10">
        // SECURING TOMORROW TODAY
      </div>

      {/* Version/Status in top left */}
      <div className="absolute top-4 left-4 text-white/30 text-sm font-mono flex items-center gap-2 z-10">
        {/* <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> */}
        <span>// HALONEX VANTA v{engineVersion}</span>
      </div>

      {/* Settings button in top right */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={handleOpenSettings}
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Main container */}
      <div className={`relative w-full max-w-6xl mx-auto transition-all duration-300 z-10 ${isAnimating ? 'scale-[0.98] opacity-90' : 'scale-100 opacity-100'}`}>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-center">
          {/* Vanta Logo - Top on mobile, Right Side on desktop */}
          <div className="flex w-full lg:w-3/2 items-center justify-center lg:order-2">
            <div className="relative">
              <img 
                src="/vanta-logo.png" 
                alt="Halonex Vanta" 
                className="w-60 lg:w-80 h-auto filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Warning Card - Bottom on mobile, Left Side on desktop */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg overflow-hidden relative group lg:order-1">
            {/* Red to transparent gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 via-red-900/20 to-transparent pointer-events-none z-0"></div>
            
            {/* Real-time scanning indicator */}
            {/* {scanProgress < 100 && (
              <div className="absolute top-1 left-0 right-0">
                <Progress value={scanProgress} className="h-0.5 bg-transparent" />
              </div>
            )} */}

          <div className="p-6 pb-0 mb-4 w-full text-center">
              <div className="flex justify-center mb-4">
                <div className="relative bg-red-600/40 backdrop-blur-sm border-2 border-red-500/60 p-3 rounded-full shadow-lg">
                  <AlertTriangle className="h-8 w-8 text-red-300" strokeWidth={2} />
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                DANGER
              </h1>

              <p className="text-white/80 text-lg font-semibold">MALICIOUS SITE BLOCKED</p>
            </div>

          <CardContent className="relative z-10 p-6 flex flex-col items-center py-[30px] pt-0">
            {/* Combined Header Section with Red Background */}
            

            <div className="mb-4">
              <p className="text-white/70 text-xs text-center mb-1">Blocked Domain</p>
              <div className="flex justify-center">
                <div className="bg-neutral-800/80 border border-neutral-700 rounded-lg px-[12px] py-[6px] hover:bg-neutral-750/80 transition-colors group">
                  <div className="flex items-center">
                    <p className="text-white font-mono font-normal text-sm">
                      {domain}
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* Main warning */}
            <div className="relative bg-red-900/40 backdrop-blur-sm border-2 border-red-500/60 rounded-xl p-4 mb-4 w-full shadow-lg shadow-red-500/20">
              {/* Enhanced HIGH RISK tag */}
              

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-red-600/40 rounded-lg flex-shrink-0 border border-red-500/50">
                  <AlertTriangle className="h-5 w-5 text-red-300" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-red-100 font-bold text-base mb-2">Malicious Website</h3>
                  <p className="text-red-200 text-sm leading-relaxed font-medium">
Halonex Vanta has detected that this site may be malicious. This site could be attempting phishing, malware distribution, or other harmful activities.                  </p>



                </div>
              </div>
            </div>

            {/* Info grid */}
            {/* <div className="grid grid-cols-3 gap-2 mb-4 w-full">
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all rounded-lg p-2.5">
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-500/20 text-red-400 group-hover:bg-red-500/30 transition-colors mb-1">
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <p className="font-semibold text-white/80 text-xs mb-0.5">Threat Type</p>
                  <p className="text-xs">
                    <span className="text-red-400 font-semibold">Malicious</span>
                  </p>
                </div>
              </div>
              
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all rounded-lg p-2.5">
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-green-500/20 text-green-400 group-hover:bg-green-500/30 transition-colors mb-1">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <p className="font-semibold text-white/80 text-xs mb-0.5">Your Status</p>
                  <p className="text-xs">
                    <span className="text-green-400 font-semibold">Protected</span>
                  </p>
                </div>
              </div>
              
              <div className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all rounded-lg p-2.5">
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors mb-1">
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                  <p className="font-semibold text-white/80 text-xs mb-0.5">Threats Blocked</p>
                  <p className="text-xs">
                    <span className="text-blue-400 font-semibold">{blockedAttempts}</span>
                  </p>
                </div>
              </div>
            </div> */}

            {/* Action buttons */}
            <div className="mb-4 flex flex-col gap-3 w-full">
              <Button
                onClick={handleGoBack}
                size="default"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back Safely
              </Button>

              <div className="flex gap-2 w-full">
                <Button
                  onClick={handleAddToWhitelist}
                  variant="outline"
                  size="default"
                  className="flex-1 border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Whitelist
                </Button>

                <Button
                  onClick={handleReportSafe}
                  variant="ghost"
                  size="default"
                  className="flex-1 border border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Report as Safe
                </Button>
              </div>
            </div>

            {/* Simple Footer */}
            <div className="pt-4 border-t border-white/10 w-full">
              {/* Main branding section */}
              <div className="flex items-center justify-center">
                {/* <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30 mr-3 shadow-lg">
                  <Shield className="h-4 w-4 text-blue-400" />
                </div> */}
                <div className="text-center">
                  <div className="text-white/90 text-sm font-semibold">
                    Powered by <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Halonex Labs</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
};
export default Index;