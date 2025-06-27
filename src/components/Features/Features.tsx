import { Camera, Phone, MessageCircle, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
const Features = () => {
  const features = [
    {
      icon: Camera,
      title: "Virtual Tours",
      description: "Immerse yourself in 360° virtual tours of Pakistan's most beautiful locations",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Phone,
      title: "Emergency Help",
      description: "24/7 emergency assistance and safety support wherever you are in Pakistan",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: MessageCircle,
      title: "AI Chatbot",
      description: "Get instant answers about destinations, culture, and travel tips from our AI guide",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      icon: MapPin,
      title: "Explore Destinations",
      description: "Discover hidden gems and popular attractions across all provinces of Pakistan",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Everything You Need to Explore Pakistan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive platform offers all the tools and support you need for the perfect Pakistani adventure
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-gray-100">
              <CardHeader>
                <div className={`w-16 h-16 mx-auto ${feature.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;