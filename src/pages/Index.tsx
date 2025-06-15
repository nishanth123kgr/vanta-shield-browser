
import { Shield, AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleVisitHalonex = () => {
    window.open('https://halonex.app', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Modern geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <Card className="relative w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-red-500/10 animate-fade-in overflow-hidden">
        {/* Premium red accent bar */}
        <div className="h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
        
        <CardContent className="p-10 text-center">
          {/* Modern shield icon with premium styling */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl scale-110 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg shadow-red-500/25">
                <Shield className="h-16 w-16 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Modern typography */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Access Blocked
          </h1>
          
          <p className="text-red-500 font-semibold text-lg mb-8 tracking-wide">
            SECURITY PROTECTION ACTIVE
          </p>
          
          {/* Premium warning box */}
          <div className="flex items-center justify-center mb-8 p-6 bg-gradient-to-r from-red-50 to-red-50/80 border border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full mr-4 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <p className="text-red-900 font-medium text-lg">
              This website has been identified as a potential phishing threat
            </p>
          </div>

          {/* Modern description */}
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            <span className="font-bold text-gray-900">Halonex Vanta</span> has automatically blocked access to this website to protect your personal information and digital security from malicious threats.
          </p>

          {/* Premium info section */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 mb-10 text-left shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 text-xl flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              Security Analysis
            </h3>
            <div className="grid gap-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700 text-lg">Domain detected in threat intelligence database</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700 text-lg">Suspicious patterns indicating credential harvesting</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700 text-lg">Potential impersonation of legitimate services</span>
              </div>
            </div>
          </div>

          {/* Premium action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button
              onClick={handleGoBack}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
            >
              <ArrowLeft className="h-6 w-6 mr-3" strokeWidth={2} />
              Return to Safety
            </Button>
            
            <Button
              onClick={handleVisitHalonex}
              variant="outline"
              size="lg"
              className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Learn More
              <ExternalLink className="h-6 w-6 ml-3" strokeWidth={2} />
            </Button>
          </div>

          {/* Premium footer */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-gray-600 text-lg">
                Protected by <span className="font-bold text-gray-900">Halonex Vanta</span>
              </span>
            </div>
            <button
              onClick={handleVisitHalonex}
              className="text-red-500 hover:text-red-600 font-semibold transition-colors duration-200 hover:underline underline-offset-4"
            >
              Visit halonex.app →
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
