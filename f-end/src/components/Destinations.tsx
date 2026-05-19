import { MapPin, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import destinationSataflia from "@/assets/destination-sataflia.jpg";
import destinationGelati from "@/assets/destination-gelati.jpg";
import destinationSignagi from "@/assets/destination-signagi.jpg";
import destinationMotsameta from "@/assets/destination-motsameta.jpg";

interface Destination {
  name: string;
  description: string;
  image: string;
  duration: string;
  rating: number;
  tags: string[];
}

const destinations: Destination[] = [
  {
    name: "Sataflia",
    description: "Explore dinosaur footprints, ancient caves, and stunning glass walkways in this natural wonder.",
    image: destinationSataflia,
    duration: "Full Day",
    rating: 4.9,
    tags: ["Nature", "Science", "Adventure"],
  },
  {
    name: "Gelati Monastery",
    description: "UNESCO World Heritage site with breathtaking medieval frescoes and rich Georgian history.",
    image: destinationGelati,
    duration: "Half Day",
    rating: 4.8,
    tags: ["History", "Culture", "UNESCO"],
  },
  {
    name: "Signagi",
    description: "The 'City of Love' with panoramic Alazani Valley views and charming cobblestone streets.",
    image: destinationSignagi,
    duration: "Full Day",
    rating: 4.9,
    tags: ["Culture", "Wine Region", "Views"],
  },
  {
    name: "Motsameta",
    description: "Cliff-edge monastery surrounded by lush forests and the scenic Tskaltsitela River canyon.",
    image: destinationMotsameta,
    duration: "Half Day",
    rating: 4.7,
    tags: ["Nature", "History", "Scenic"],
  },
];

const Destinations = () => {
  return (
    <section id="destinations" className="py-20 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Popular Destinations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Discover Georgia's{" "}
            <span className="text-gradient">Hidden Treasures</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our curated selection of educational and adventure destinations 
            perfect for unforgettable school trips.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={destination.name}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-golden text-golden-foreground text-sm font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {destination.rating}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-sm font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {destination.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {destination.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
      </div>
    </section>
  );
};

export default Destinations;
