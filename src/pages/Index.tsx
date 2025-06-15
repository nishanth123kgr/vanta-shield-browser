
import { Shield, AlertTriangle, ArrowLeft, ExternalLink, Clock, Globe, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleLearnMore = () => {
    window.open('https://halonex.app', '_blank');
  };

  const handleReportSafe = () => {
    console.log("Reporting site as safe");
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {/* Main container */}
      <div className="relative w-full max-w-4xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Warning accent bar */}
          <div className="h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
          
          <CardContent className="p-16">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-8">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl">
                  <Shield className="h-14 w-14 text-orange-400" strokeWidth={1.5} />
                </div>
              </div>

              <h1 className="text-6xl font-bold text-white mb-6">
                Site Blocked
              </h1>
              
              <div className="inline-block bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 px-8 py-4 rounded-full mb-6">
                <p className="text-orange-300 font-medium text-xl">
                  PHISHING PROTECTION ACTIVE
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 text-white/60 text-lg">
                <Clock className="h-6 w-6" />
                <span>Blocked {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Main warning */}
            <div className="bg-orange-500/15 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-8 mb-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-500/30 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-orange-300" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-2xl mb-4">Dangerous Website</h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    This site may steal your personal information and compromise your digital security.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick info grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <Globe className="h-6 w-6 text-blue-300" />
                  <div>
                    <p className="font-medium text-white text-lg">Threat Type</p>
                    <p className="text-lg text-white/70">Advanced Phishing</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <Zap className="h-6 w-6 text-purple-300" />
                  <div>
                    <p className="font-medium text-white text-lg">AI Defense</p>
                    <p className="text-lg text-white/70">Vanta Engine</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-6 mb-8">
              <Button
                onClick={handleGoBack}
                size="lg"
                className="w-full bg-blue-600/80 backdrop-blur-sm border border-blue-500/50 hover:bg-blue-600 text-white rounded-xl font-medium text-xl py-6"
              >
                <ArrowLeft className="h-7 w-7 mr-3" />
                Go Back Safely
              </Button>
              
              <Button
                onClick={handleLearnMore}
                variant="outline"
                size="sm"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 rounded-xl font-medium text-lg py-4"
              >
                Learn About Advanced Protection
                <ExternalLink className="h-6 w-6 ml-3" />
              </Button>
            </div>

            {/* Footer with creative branding */}
            <div className="pt-8 border-t border-white/20 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-300" />
                    <span className="text-white/90 text-lg font-medium">Secured by</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    <span className="text-xl font-bold">Halonex</span>
                    <Zap className="h-5 w-5 text-purple-400" />
                    <span className="text-xl font-bold">Vanta</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 inline-block">
                <p className="text-white/80 text-base">
                  🛡️ Next-gen AI security • 🚀 Real-time threat detection • ⚡ Powered by Vanta intelligence
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
