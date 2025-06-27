import { Button } from "../../components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
           backgroundImage: "url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          //backgroundImage: "url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Explore the Beauty of
          <span className="text-green-600 block">Pakistan</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Experience virtual tours, get emergency assistance, chat with our AI guide, 
          and discover breathtaking destinations across Pakistan
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="group bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold 
                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 
                     border-0 rounded-xl relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Start Virtual Tour
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="group border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 
                     px-8 py-4 text-lg font-semibold backdrop-blur-sm bg-white/10 
                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 
                     rounded-xl relative overflow-hidden"
          >
            <span className="relative z-10">Explore Destinations</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300"></div>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
        <div className="text-center group cursor-pointer">
            <div className="text-5xl md:text-6xl font-black text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300">10+</div>
            <div className="text-emerald-200 text-base font-semibold uppercase tracking-wider">Virtual Tours</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-5xl md:text-6xl font-black text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300">24/7</div>
            <div className="text-emerald-200 text-base font-semibold uppercase tracking-wider">Emergency Help</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-5xl md:text-6xl font-black text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300">500+</div>
            <div className="text-emerald-200 text-base font-semibold uppercase tracking-wider">Destinations</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-5xl md:text-6xl font-black text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300">AI</div>
            <div className="text-emerald-200 text-base font-semibold uppercase tracking-wider">Travel Guide</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;