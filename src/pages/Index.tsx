
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Network, 
  Users, 
  Calendar, 
  User, 
  Building2, 
  FlaskConical, 
  UserCheck, 
  Briefcase,
  Search,
  Shield,
  Zap,
  BookOpen,
  Target,
  TrendingUp,
  Star,
  CheckCircle
} from "lucide-react";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              The Complete
              <span className="text-primary block">Pharmaceutical Ecosystem</span>
              Platform
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-4xl mx-auto">
              Connecting pharmaceutical companies, laboratories, consultants, suppliers, and professionals in one intelligent platform
            </p>
            <p className="text-lg text-primary font-medium mb-8 max-w-3xl mx-auto">
              Where the entire pharmaceutical industry collaborates, innovates, and grows together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-600 px-8 py-3 text-lg">
                Join as Professional
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 py-3 text-lg">
                Register Your Company
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 py-3 text-lg">
                List Your Laboratory
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 py-3 text-lg">
                Become a Supplier
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Sections */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Every Pharmaceutical Stakeholder
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how PharmaNexus accelerates success for all industry participants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pharmaceutical Companies */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Pharmaceutical Companies & Industries</h3>
                <ul className="text-gray-600 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Find specialized laboratories, consultants, and suppliers</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Access regulatory intelligence and compliance tools</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Post innovation challenges and find solutions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Connect with the best talent and service providers</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Laboratories */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <FlaskConical className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Laboratories & Service Providers</h3>
                <ul className="text-gray-600 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Optimize your capacity utilization</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Connect with companies needing your services</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Showcase your specialized capabilities</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Collaborate on multi-company projects</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Consultants */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Consultants & Experts</h3>
                <ul className="text-gray-600 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Access qualified leads from pharmaceutical companies</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Share expertise through our knowledge marketplace</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Build your professional reputation and network</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Participate in collaborative industry projects</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Professionals */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Professionals & Career Growth</h3>
                <ul className="text-gray-600 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Accelerate your pharmaceutical career</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Connect with industry mentors and leaders</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Access exclusive job opportunities</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Stay updated with industry trends and regulations</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Features Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligent Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced technology powering pharmaceutical industry collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI-Powered Matching Engine</h3>
              <p className="text-gray-600">Automatically connects complementary needs and capabilities across the ecosystem</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Regulatory Intelligence Center</h3>
              <p className="text-gray-600">Real-time ANVISA, FDA updates and compliance tools for seamless operations</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Search className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">B2B Marketplace</h3>
              <p className="text-gray-600">Equipment, services, and collaborative opportunities in one platform</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Knowledge Repository</h3>
              <p className="text-gray-600">Templates, case studies, and industry best practices shared by experts</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Project Collaboration Hub</h3>
              <p className="text-gray-600">Multi-stakeholder pharmaceutical projects managed seamlessly</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Network className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Networking</h3>
              <p className="text-gray-600">Connect with the right professionals, mentors, and industry leaders</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Powering Pharmaceutical Collaboration
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-primary-100">Pharmaceutical Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">Companies Finding Solutions Daily</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">300+</div>
              <div className="text-primary-100">Laboratories Optimizing Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1,000+</div>
              <div className="text-primary-100">Successful Collaborations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories Across the Industry
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "PharmaNexus connected us with specialized analytical laboratories that we wouldn't have found otherwise. 
                The platform's matching system saved us months of searching and helped us launch our product 40% faster."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Dr. Maria Santos</div>
                  <div className="text-sm text-gray-500">VP of R&D, BioPharma Brasil</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Our laboratory capacity utilization increased by 60% after joining PharmaNexus. 
                The platform consistently brings us high-quality projects from pharmaceutical companies."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Carlos Ferreira</div>
                  <div className="text-sm text-gray-500">Director, AnalyticLab São Paulo</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "As a regulatory consultant, PharmaNexus has become my primary source of qualified leads. 
                The platform's intelligent matching brings me clients who need exactly my expertise."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Ana Rodrigues</div>
                  <div className="text-sm text-gray-500">Senior Regulatory Consultant</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "PharmaNexus accelerated my career beyond my expectations. The mentorship program and networking 
                opportunities helped me transition from QC analyst to QC manager in just 18 months."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">João Silva</div>
                  <div className="text-sm text-gray-500">Quality Control Manager</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-Action Sections */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Collaborating Today
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join the pharmaceutical ecosystem where innovation meets collaboration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
              Join the Ecosystem
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
              Book a Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
              Explore Platform
            </Button>
          </div>
          <p className="text-primary-100">
            Trusted by leading pharmaceutical companies, laboratories, and professionals across Brazil
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Network className="h-6 w-6" />
                <span className="text-xl font-bold">PharmaNexus</span>
              </div>
              <p className="text-gray-400">
                The complete pharmaceutical ecosystem platform connecting all industry stakeholders.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Find Laboratories</a></li>
                <li><a href="#" className="hover:text-white">Hire Consultants</a></li>
                <li><a href="#" className="hover:text-white">Source Suppliers</a></li>
                <li><a href="#" className="hover:text-white">Post Projects</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Service Providers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">List Your Lab</a></li>
                <li><a href="#" className="hover:text-white">Consulting Services</a></li>
                <li><a href="#" className="hover:text-white">Supplier Network</a></li>
                <li><a href="#" className="hover:text-white">Capacity Optimization</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Knowledge Library</a></li>
                <li><a href="#" className="hover:text-white">Regulatory Updates</a></li>
                <li><a href="#" className="hover:text-white">Industry Forums</a></li>
                <li><a href="#" className="hover:text-white">Support Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PharmaNexus. Transforming pharmaceutical collaboration.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
