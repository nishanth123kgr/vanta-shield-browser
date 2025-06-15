
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-slate-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Main container */}
      <div className="relative w-full max-w-2xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-fade-in">
          {/* Warning accent bar */}
          <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
          
          <CardContent className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl">
                  <Shield className="h-12 w-12 text-orange-400" strokeWidth={1.5} />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Site Blocked
              </h1>
              
              <div className="inline-block bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 px-4 py-2 rounded-full mb-4">
                <p className="text-orange-300 font-medium text-sm">
                  PHISHING PROTECTION ACTIVE
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <Clock className="h-4 w-4" />
                <span>Blocked {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Main warning */}
            <div className="bg-orange-500/15 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-500/30 rounded-xl flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-orange-300" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Dangerous Website</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    This site is attempting to steal your personal information. 
                    <strong className="block mt-2 text-orange-300">Do not enter passwords or personal details.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick info grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-300" />
                  <div>
                    <p className="font-medium text-white text-sm">Threat Detected</p>
                    <p className="text-xs text-white/70">Credential harvesting</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-green-300" />
                  <div>
                    <p className="font-medium text-white text-sm">You're Protected</p>
                    <p className="text-xs text-white/70">By Halonex Vanta</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                onClick={handleGoBack}
                size="lg"
                className="bg-blue-600/80 backdrop-blur-sm border border-blue-500/50 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back Safely
              </Button>
              
              <Button
                onClick={handleVisitHalonex}
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 rounded-xl font-medium"
              >
                Learn More
                <ExternalLink className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Advanced options */}
            <details className="group mb-4">
              <summary className="text-white/80 hover:text-white cursor-pointer text-sm font-medium bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all">
                Advanced Options
                <span className="float-right transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-sm text-white/70 mb-3">
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
            <div className="pt-4 border-t border-white/20 text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-4 w-4 text-blue-300 mr-2" />
                <span className="text-white/90 text-sm">
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
