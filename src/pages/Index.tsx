
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-slate-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Main container */}
      <div className="relative w-full max-w-md mx-auto">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Warning accent bar */}
          <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
          
          <CardContent className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-xl">
                  <Shield className="h-8 w-8 text-orange-400" strokeWidth={1.5} />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Site Blocked
              </h1>
              
              <div className="inline-block bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 px-3 py-1 rounded-full mb-3">
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
            <div className="bg-orange-500/15 backdrop-blur-sm border border-orange-400/30 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-500/30 rounded-lg flex-shrink-0">
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
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-300" />
                  <div>
                    <p className="font-medium text-white text-xs">Threat Type</p>
                    <p className="text-xs text-white/70">Phishing</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-300" />
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
                className="w-full bg-blue-600/80 backdrop-blur-sm border border-blue-500/50 hover:bg-blue-600 text-white rounded-lg font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back Safely
              </Button>
              
              <Button
                onClick={handleVisitHalonex}
                variant="outline"
                size="lg"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 rounded-lg font-medium"
              >
                Learn More
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Advanced options */}
            <details className="group mb-4">
              <summary className="text-white/80 hover:text-white cursor-pointer text-xs font-medium bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all">
                Advanced Options
                <span className="float-right transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-2 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-xs text-white/70 mb-2">
                  Report if incorrectly blocked
                </p>
                <Button
                  onClick={handleReportSafe}
                  variant="outline"
                  size="sm"
                  className="bg-white/5 text-white/80 border-white/30 hover:bg-white/10 text-xs"
                >
                  Report as Safe
                </Button>
              </div>
            </details>

            {/* Footer */}
            <div className="pt-3 border-t border-white/20 text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-3 w-3 text-blue-300 mr-2" />
                <span className="text-white/90 text-xs">
                  Protected by <span className="font-semibold">Halonex Vanta</span>
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
