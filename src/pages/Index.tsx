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
  return <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {/* Main container */}
      <div className="relative w-full max-w-2xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-t-2xl">
          {/* Warning accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-t-2xl"></div>
          
          <CardContent className="p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                  <Shield className="h-10 w-10 text-orange-400" strokeWidth={1.5} />
                </div>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                Site Blocked
              </h1>
              
              <div className="inline-block bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 px-5 py-2.5 rounded-full mb-4">
                <p className="text-orange-300 font-medium text-base">
                  PHISHING PROTECTION ACTIVE
                </p>
              </div>

              
            </div>

            {/* Main warning */}
            <div className="bg-orange-500/15 backdrop-blur-sm border border-orange-400/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-500/30 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-orange-300" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-xl mb-3">Dangerous Website</h3>
                  <p className="text-white/90 text-base leading-relaxed">
                    This site may steal your personal information.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick info grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-300" />
                  <div>
                    <p className="font-medium text-white text-base">Threat</p>
                    <p className="text-base text-white/70">Phishing</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-green-300" />
                  <div>
                    <p className="font-medium text-white text-base">Protected</p>
                    <p className="text-base text-white/70">By Halonex Vanta</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4 mb-6">
              <Button onClick={handleGoBack} size="lg" className="w-full bg-blue-600/80 backdrop-blur-sm border border-blue-500/50 hover:bg-blue-600 text-white rounded-lg font-medium text-lg py-4">
                <ArrowLeft className="h-6 w-6 mr-2" />
                Go Back Safely
              </Button>
              {/* "Learn More" button has been removed as per user request */}
            </div>

            {/* Footer */}
            <div className="pt-5 border-t border-white/20 text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-blue-300 mr-2" />
                <span className="text-white/90 text-base">
                  Protected by <span className="font-semibold">Halonex Vanta</span>
                </span>
              </div>
              {/* Call-to-action made subtle; no direct company link per user request */}
              <span className="text-blue-300 text-base italic">
                Discover more about next-gen security at <span className="font-semibold">Halonex Vanta</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Index;