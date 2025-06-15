
import { Shield, AlertTriangle, ArrowLeft, ExternalLink, Clock, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleVisitHalonex = () => {
    window.open('https://halonex.app', '_blank');
  };

  const handleReportSafe = () => {
    console.log("Reporting site as safe");
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {/* Main container */}
      <div className="relative w-full max-w-sm mx-auto">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Warning accent bar */}
          <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
          
          <CardContent className="p-5">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="flex justify-center mb-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2.5 rounded-xl">
                  <Shield className="h-6 w-6 text-orange-400" strokeWidth={1.5} />
                </div>
              </div>

              <h1 className="text-xl font-bold text-white mb-2">
                Site Blocked
              </h1>
              
              <div className="inline-block bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 px-2.5 py-1 rounded-full mb-2">
                <p className="text-orange-300 font-medium text-xs">
                  PHISHING PROTECTION
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
                <Clock className="h-3 w-3" />
                <span>Blocked {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Main warning */}
            <div className="bg-orange-500/15 backdrop-blur-sm border border-orange-400/30 rounded-xl p-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-7 h-7 bg-orange-500/30 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-orange-300" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">Dangerous Website</h3>
                  <p className="text-white/90 text-xs leading-relaxed">
                    This site may steal your personal information.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick info grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3 text-blue-300" />
                  <div>
                    <p className="font-medium text-white text-xs">Threat</p>
                    <p className="text-xs text-white/70">Phishing</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3 text-green-300" />
                  <div>
                    <p className="font-medium text-white text-xs">Protected</p>
                    <p className="text-xs text-white/70">By Halonex</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 mb-4">
              <Button
                onClick={handleGoBack}
                size="lg"
                className="w-full bg-blue-600/80 backdrop-blur-sm border border-blue-500/50 hover:bg-blue-600 text-white rounded-lg font-medium text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back Safely
              </Button>
              
              <Button
                onClick={handleVisitHalonex}
                variant="outline"
                size="sm"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 rounded-lg font-medium text-xs"
              >
                Learn More
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/20 text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-3 w-3 text-blue-300 mr-2" />
                <span className="text-white/90 text-xs">
                  Protected by <span className="font-semibold">Halonex</span>
                </span>
              </div>
              <button
                onClick={handleVisitHalonex}
                className="text-blue-300 hover:text-blue-200 text-xs transition-colors hover:underline"
              >
                Visit halonex.app →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
