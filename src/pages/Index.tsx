
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="m20 20 20 20-20-20Z"/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <Card className="relative w-full max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl animate-fade-in">
        <CardContent className="p-8 text-center">
          {/* Header with Shield Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-red-500 p-4 rounded-full">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Site Blocked
          </h1>
          
          {/* Warning Message */}
          <div className="flex items-center justify-center mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
            <p className="text-amber-800 font-medium">
              This website has been identified as a potential phishing site
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            <strong>Halonex Vanta</strong> has blocked access to this website to protect you from potential security threats. 
            Phishing sites attempt to steal your personal information, passwords, or financial details.
          </p>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">Why was this site blocked?</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The site may be impersonating a legitimate service
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                It could be attempting to steal your personal information
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The domain appears in our security threat database
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGoBack}
              variant="default"
              size="lg"
              className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back to Safety
            </Button>
            
            <Button
              onClick={handleVisitHalonex}
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              Learn More
              <ExternalLink className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-2">
              Protected by <strong className="text-slate-700">Halonex Vanta</strong>
            </p>
            <button
              onClick={handleVisitHalonex}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 hover:underline"
            >
              Visit halonex.app
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-0 w-16 h-16 bg-red-500/10 rounded-full blur-xl"></div>
    </div>
  );
};

export default Index;
