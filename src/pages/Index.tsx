
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
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-72 h-72 bg-red-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      
      {/* Glass morphism main container */}
      <div className="relative w-full max-w-6xl mx-auto">
        {/* Main glass card */}
        <Card className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/25 animate-fade-in overflow-hidden">
          {/* Premium red accent bar with glow */}
          <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-red-400 shadow-lg shadow-red-500/50"></div>
          
          <CardContent className="p-12">
            {/* Header Section */}
            <div className="text-center mb-12">
              {/* Glass morphism shield container */}
              <div className="flex justify-center mb-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/30 rounded-3xl blur-2xl scale-110 animate-pulse"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl shadow-red-500/20">
                    <Shield className="h-20 w-20 text-red-400 drop-shadow-lg" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Phishing Site Blocked
              </h1>
              
              <div className="inline-block bg-red-500/20 backdrop-blur-sm border border-red-400/30 px-6 py-3 rounded-full mb-6">
                <p className="text-red-300 font-semibold text-lg tracking-wide">
                  SECURITY PROTECTION ACTIVE
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-white/70 mb-8">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Blocked {new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* Main Warning Section with glass morphism */}
            <div className="mb-12">
              <div className="bg-red-500/15 backdrop-blur-xl border border-red-400/30 rounded-3xl p-8 shadow-xl">
                <div className="flex items-start gap-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-500/30 backdrop-blur-sm rounded-2xl border border-red-400/40 flex-shrink-0">
                    <AlertTriangle className="h-7 w-7 text-red-300" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-3">Dangerous Website Detected</h3>
                    <p className="text-white/90 text-lg leading-relaxed">
                      This website is attempting to steal your personal information by impersonating legitimate services. 
                      <strong className="block mt-3 text-red-300">Do not enter any passwords, credit card information, or personal details.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid with glass morphism cards */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Threat Analysis Glass Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-white mb-6 text-xl flex items-center">
                  <div className="w-4 h-4 bg-red-400 rounded-full mr-4 shadow-lg shadow-red-400/50"></div>
                  Security Analysis
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-400/30">
                      <Globe className="h-5 w-5 text-red-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Suspicious Domain</p>
                      <p className="text-sm text-white/70">Domain detected in threat intelligence database</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-400/30">
                      <Lock className="h-5 w-5 text-red-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Credential Harvesting</p>
                      <p className="text-sm text-white/70">Suspicious login forms designed to steal passwords</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-400/30">
                      <AlertTriangle className="h-5 w-5 text-red-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Brand Impersonation</p>
                      <p className="text-sm text-white/70">Attempting to mimic legitimate websites or services</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Protection Tips Glass Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-white mb-6 text-xl flex items-center">
                  <div className="w-4 h-4 bg-blue-400 rounded-full mr-4 shadow-lg shadow-blue-400/50"></div>
                  Stay Protected
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30">
                      <Info className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Never Enter Personal Info</p>
                      <p className="text-sm text-white/70">Don't provide passwords, SSN, or financial details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30">
                      <Shield className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Verify Websites</p>
                      <p className="text-sm text-white/70">Always check URLs and use official websites directly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30">
                      <Lock className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Report Suspicious Sites</p>
                      <p className="text-sm text-white/70">Help protect others by reporting phishing attempts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glass morphism action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
              <Button
                onClick={handleGoBack}
                size="lg"
                className="bg-red-500/30 backdrop-blur-xl border border-red-400/40 hover:bg-red-500/50 text-white px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 group"
              >
                <ArrowLeft className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
                Return to Safety
              </Button>
              
              <Button
                onClick={handleVisitHalonex}
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              >
                Learn About Protection
                <ExternalLink className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </Button>
            </div>

            {/* Advanced Options with glass morphism */}
            <div className="text-center mb-10">
              <details className="group">
                <summary className="text-white/80 hover:text-white cursor-pointer inline-flex items-center gap-3 font-medium transition-all duration-300 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/10">
                  Advanced Options
                  <span className="transition-transform group-open:rotate-180 bg-white/20 p-1 rounded-full">▼</span>
                </summary>
                <div className="mt-6 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                  <p className="text-sm text-white/70 mb-6">
                    If you believe this site was incorrectly blocked, you can report it for review.
                  </p>
                  <Button
                    onClick={handleReportSafe}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 backdrop-blur-sm text-white/80 border-white/30 hover:bg-white/10 hover:text-white rounded-xl"
                  >
                    Report as Safe
                  </Button>
                </div>
              </details>
            </div>

            {/* Premium footer with glass morphism */}
            <div className="pt-8 border-t border-white/20 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-10 h-10 bg-red-500/30 backdrop-blur-sm border border-red-400/40 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Shield className="h-5 w-5 text-red-300" strokeWidth={2} />
                </div>
                <span className="text-white/90 text-xl">
                  Protected by <span className="font-bold text-white">Halonex Vanta</span>
                </span>
              </div>
              <p className="text-sm text-white/60 mb-4">
                Real-time phishing protection • Advanced threat detection • Zero-day security
              </p>
              <button
                onClick={handleVisitHalonex}
                className="text-red-300 hover:text-red-200 font-semibold transition-all duration-300 hover:underline underline-offset-4 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10"
              >
                Visit halonex.app for enterprise security →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
