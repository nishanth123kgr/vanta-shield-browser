import { Shield, Globe, Lock, Download, Star, ExternalLink, Play, CheckCircle, AlertTriangle, Code, Database, Zap, Eye, Settings as SettingsIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

const Showcase = () => {
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [threatsStopped, setThreatsStopped] = useState(0);
  const [scanningActive, setScanningActive] = useState(false);
  const [liveDemoStep, setLiveDemoStep] = useState(0);

  useEffect(() => {
    setIsAnimating(true);
    // Animate threat counter
    const interval = setInterval(() => {
      setThreatsStopped(prev => prev < 24723 ? prev + 17 : 24723);
    }, 50);

    setTimeout(() => clearInterval(interval), 3000);
    return () => clearInterval(interval);
  }, []);

  const startLiveDemo = () => {
    setScanningActive(true);
    setLiveDemoStep(1);
    setDemoProgress(0);

    // Step 1: Initialize scanning
    setTimeout(() => {
      setDemoProgress(25);
      setLiveDemoStep(2);
    }, 1000);

    // Step 2: Threat detection
    setTimeout(() => {
      setDemoProgress(50);
      setLiveDemoStep(3);
    }, 2000);

    // Step 3: YARA analysis
    setTimeout(() => {
      setDemoProgress(75);
      setLiveDemoStep(4);
    }, 3000);

    // Step 4: Block action
    setTimeout(() => {
      setDemoProgress(100);
      setLiveDemoStep(5);
      setScanningActive(false);
      toast({
        title: "Demo Complete!",
        description: "Malicious site blocked successfully",
      });
    }, 4000);
  };

  const resetDemo = () => {
    setLiveDemoStep(0);
    setDemoProgress(0);
    setScanningActive(false);
  };

  const features = [
    {
      icon: Shield,
      title: "Real-time Protection",
      description: "Advanced YARA-based threat detection protects you from phishing, malware, and malicious downloads in real-time.",
      stats: "99.9% detection rate"
    },
    {
      icon: Database,
      title: "Cloud Intelligence",
      description: "Powered by Halonex's threat intelligence database with millions of known malicious domains and signatures.",
      stats: "24M+ threats identified"
    },
    {
      icon: Zap,
      title: "Lightweight & Fast",
      description: "Minimal performance impact with smart caching and optimized scanning algorithms.",
      stats: "<1ms response time"
    },
    {
      icon: Eye,
      title: "Privacy First",
      description: "Domains are hashed before transmission. No browsing data is stored or tracked.",
      stats: "Zero data collection"
    }
  ];

  const demoSteps = [
    { step: 1, text: "Initializing YARA engine...", icon: Code },
    { step: 2, text: "Scanning domain reputation...", icon: Globe },
    { step: 3, text: "Analyzing threat patterns...", icon: AlertTriangle },
    { step: 4, text: "Cross-referencing threat database...", icon: Database },
    { step: 5, text: "Threat blocked successfully!", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="relative">
              <Shield className="h-16 w-16 text-blue-400" />
              <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Vanta Shield
              </h1>
              <p className="text-xl text-gray-300 mt-2">Browser Security Extension</p>
            </div>
          </div>
          
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Advanced browser protection powered by YARA threat detection. Safeguard your browsing experience 
            from phishing attacks, malicious downloads, and cyber threats with enterprise-grade security.
          </p>
          
          <div className="flex justify-center items-center gap-6 mt-8">
            <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              Active Protection
            </Badge>
            <Badge variant="secondary" className="bg-blue-900/30 text-blue-400 border-blue-800">
              <Star className="h-4 w-4 mr-2" />
              {threatsStopped.toLocaleString()} Threats Blocked
            </Badge>
          </div>
        </div>

        {/* Live Demo Section */}
        <Card className="mb-12 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-white">
              <Play className="h-6 w-6 text-blue-400" />
              Live Protection Demo
            </CardTitle>
            <p className="text-gray-400">
              Experience real-time threat detection in action
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="bg-slate-900 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Simulated Malicious Domain:</span>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
                <div className="font-mono text-lg text-red-400 bg-red-950/30 rounded p-3 border border-red-800">
                  https://phishing-bank-site.malicious.example
                </div>
              </div>

              <div className="space-y-4">
                <Progress value={demoProgress} className="h-3" />
                
                {liveDemoStep > 0 && (
                  <div className="space-y-2">
                    {demoSteps.slice(0, liveDemoStep).map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <div key={step.step} className="flex items-center gap-3 text-left">
                          <IconComponent className={`h-5 w-5 ${
                            step.step === liveDemoStep ? 'text-blue-400' : 'text-green-400'
                          }`} />
                          <span className={`${
                            step.step === liveDemoStep ? 'text-blue-400' : 'text-green-400'
                          }`}>
                            {step.text}
                          </span>
                          {step.step < liveDemoStep && (
                            <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center mt-6">
                <Button 
                  onClick={startLiveDemo} 
                  disabled={scanningActive}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {scanningActive ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Demo
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetDemo}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70 ${
                isAnimating ? 'animate-fade-in-up' : ''
              }`} style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <IconComponent className="h-8 w-8 text-blue-400" />
                      <div className="absolute inset-0 bg-blue-400/20 blur-lg rounded-full" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-3">{feature.description}</p>
                  <Badge variant="secondary" className="bg-purple-900/30 text-purple-400 border-purple-800">
                    {feature.stats}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Architecture Overview */}
        <Card className="mb-12 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Code className="h-6 w-6 text-purple-400" />
              Technical Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Browser Extension</h3>
                <p className="text-sm text-gray-400">Manifest V3 extension with content scripts and background workers</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">YARA Engine</h3>
                <p className="text-sm text-gray-400">WebAssembly-based malware detection with custom rule sets</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Threat Intelligence</h3>
                <p className="text-sm text-gray-400">Real-time API with hashed domain lookup and caching</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download and Links */}
        <div className="text-center space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-white mb-4">Get Started</h3>
              <p className="text-gray-400 mb-6">
                Download the extension or explore the source code on GitHub
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-5 w-5 mr-2" />
                  Download Extension
                </Button>
                
                <Button size="lg" variant="outline" className="border-slate-600 text-white">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  View on GitHub
                </Button>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="lg" variant="outline" className="border-slate-600 text-white">
                        <SettingsIcon className="h-5 w-5 mr-2" />
                        Live Settings
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Access the extension settings page</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span>Built by Halonex</span>
            <span>•</span>
            <span>Open Source</span>
            <span>•</span>
            <span>Privacy Focused</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
