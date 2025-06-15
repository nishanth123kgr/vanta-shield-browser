
import { Shield, AlertTriangle, ArrowLeft, ExternalLink, Info, Clock, Globe, Lock } from "lucide-react";
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
    // This would typically send a report to Halonex
    console.log("Reporting site as safe");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Modern geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <Card className="relative w-full max-w-4xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-red-500/10 animate-fade-in overflow-hidden">
        {/* Premium red accent bar */}
        <div className="h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
        
        <CardContent className="p-10">
          {/* Header Section */}
          <div className="text-center mb-10">
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
              Phishing Site Blocked
            </h1>
            
            <p className="text-red-500 font-semibold text-lg mb-4 tracking-wide">
              SECURITY PROTECTION ACTIVE
            </p>

            <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Blocked {new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Main Warning Section */}
          <div className="flex items-start justify-center mb-10 p-6 bg-gradient-to-r from-red-50 to-red-50/80 border border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full mr-4 flex-shrink-0 mt-1">
              <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-red-900 font-bold text-xl mb-2">Dangerous Website Detected</h3>
              <p className="text-red-800 text-lg leading-relaxed">
                This website is attempting to steal your personal information by impersonating legitimate services. 
                <strong className="block mt-2">Do not enter any passwords, credit card information, or personal details.</strong>
              </p>
            </div>
          </div>

          {/* Educational Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Threat Analysis */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                Security Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Suspicious Domain</p>
                    <p className="text-sm text-gray-600">Domain detected in threat intelligence database</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Lock className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Credential Harvesting</p>
                    <p className="text-sm text-gray-600">Suspicious login forms designed to steal passwords</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Brand Impersonation</p>
                    <p className="text-sm text-gray-600">Attempting to mimic legitimate websites or services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Do */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                Stay Protected
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Never Enter Personal Info</p>
                    <p className="text-sm text-gray-600">Don't provide passwords, SSN, or financial details</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Verify Websites</p>
                    <p className="text-sm text-gray-600">Always check URLs and use official websites directly</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Lock className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Report Suspicious Sites</p>
                    <p className="text-sm text-gray-600">Help protect others by reporting phishing attempts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
              Learn About Protection
              <ExternalLink className="h-6 w-6 ml-3" strokeWidth={2} />
            </Button>
          </div>

          {/* Advanced Options */}
          <div className="text-center mb-8">
            <details className="group">
              <summary className="text-gray-600 hover:text-gray-800 cursor-pointer inline-flex items-center gap-2 font-medium transition-colors">
                Advanced Options
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  If you believe this site was incorrectly blocked, you can report it for review.
                </p>
                <Button
                  onClick={handleReportSafe}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 border-gray-300 hover:bg-gray-100"
                >
                  Report as Safe
                </Button>
              </div>
            </details>
          </div>

          {/* Premium footer */}
          <div className="pt-8 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-gray-600 text-lg">
                Protected by <span className="font-bold text-gray-900">Halonex Vanta</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Real-time phishing protection • Advanced threat detection • Zero-day security
            </p>
            <button
              onClick={handleVisitHalonex}
              className="text-red-500 hover:text-red-600 font-semibold transition-colors duration-200 hover:underline underline-offset-4"
            >
              Visit halonex.app for enterprise security →
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
