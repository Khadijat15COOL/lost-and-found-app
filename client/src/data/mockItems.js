import campusBg from "@assets/stock_images/university_campus_bu_ce9659b4.jpg";
import bottleImg from "@assets/stock_images/blue_water_bottle_on_b3f90dbc.jpg";
import backpackImg from "@assets/stock_images/black_backpack_schoo_e424b101.jpg";
import textbookImg from "@assets/stock_images/calculus_textbook_on_842f83c9.jpg";
import headphonesImg from "@assets/stock_images/wireless_headphones__305d05eb.jpg";
import keysImg from "@assets/stock_images/set_of_keys_with_key_e0661789.jpg";

export const mockItems = [
  {
    id: 1,
    name: "Blue Hydro Flask",
    category: "Bottles",
    status: "lost",
    location: "Lecture Hall A",
    date: "May 15, 2025",
    image: bottleImg,
    description: "32oz wide mouth bottle with a few stickers on it. Left it on the second row during Chem 101.",
    claimed: false,
    reporterName: "John Doe",
    reporterContact: "john@example.com"
  },
  {
    id: 2,
    name: "Calculus Textbook",
    category: "Books",
    status: "found",
    location: "Campus Garden",
    date: "May 14, 2025",
    image: textbookImg,
    description: "Early Transcendentals, 8th Edition. Found on a bench near the fountain.",
    claimed: false,
    reporterName: "Jane Smith",
    reporterContact: "jane@example.com"
  },
  {
    id: 3,
    name: "Black North Face Backpack",
    category: "Bags",
    status: "lost",
    location: "Cafeteria",
    date: "May 16, 2025",
    image: backpackImg,
    description: "Contains a laptop and gym clothes. Black with white logo.",
    claimed: false,
    reporterName: "Mike Ross",
    reporterContact: "mike@example.com"
  },
  {
    id: 4,
    name: "AirPods Pro Case",
    category: "Electronics",
    status: "found",
    location: "Library 2nd Floor",
    date: "May 13, 2025",
    image: headphonesImg,
    description: "White case with a silicone cover. Found on table 42.",
    claimed: true,
    reporterName: "Sarah Connor",
    reporterContact: "sarah@example.com"
  },
  {
    id: 5,
    name: "Car Keys",
    category: "Accessories",
    status: "found",
    location: "Parking Lot B",
    date: "May 16, 2025",
    image: keysImg,
    description: "Toyota key fob with a red lanyard.",
    claimed: false,
    reporterName: "Security Desk",
    reporterContact: "security@bells.edu"
  },
  {
    id: 6,
    name: "Scientific Calculator",
    category: "Electronics",
    status: "lost",
    location: "Exam Hall",
    date: "May 12, 2025",
    image: "https://images.unsplash.com/photo-1574602305391-81b455b4b1a2?q=80&w=800&auto=format&fit=crop",
    description: "Casio fx-991EX. Has my initials 'AB' scratched on the back.",
    claimed: false,
    reporterName: "Alex Brown",
    reporterContact: "alex@example.com"
  },
  {
    id: 7,
    name: "Red Umbrella",
    category: "Accessories",
    status: "found",
    location: "Main Entrance",
    date: "May 10, 2025",
    image: "https://images.unsplash.com/photo-1555547466-932d2948c582?q=80&w=800&auto=format&fit=crop",
    description: "Compact red umbrella, left near the door during the rain.",
    claimed: false,
    reporterName: "Front Desk",
    reporterContact: "info@bells.edu"
  },
  {
    id: 8,
    name: "Student ID Card",
    category: "Other",
    status: "found",
    location: "Student Center",
    date: "May 15, 2025",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
    description: "ID card belonging to 'Michael Chen'. Turned into student affairs.",
    claimed: false,
    reporterName: "Rachel Green",
    reporterContact: "rachel@example.com"
  }
];

export const campusImage = campusBg;
