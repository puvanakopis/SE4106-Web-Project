import closeIcon from './closeIcon.svg'
import locationIcon from './Accommodation/locationIcon.svg'

import accommodationImg1 from './Room/accommodation1_1.avif'
import accommodationImg2 from './Room/accommodation1_2.avif'
import accommodationImg3 from './Room/accommodation1_3.jpeg'
import accommodationImg4 from './Room/accommodation1_4.avif'

import accommodationImg1_1 from './Room/accommodation1_1.avif'
import accommodationImg1_2 from './Room/accommodation1_2.avif'
import accommodationImg1_3 from './Room/accommodation1_3.jpeg'
import accommodationImg1_4 from './Room/accommodation1_4.avif'
import accommodationImg2_1 from './Room/accommodation2_1.avif'
import accommodationImg2_2 from './Room/accommodation2_2.jpeg'
import accommodationImg2_3 from './Room/accommodation2_3.avif'
import accommodationImg2_4 from './Room/accommodation2_4.jpeg'
import accommodationImg3_1 from './Room/accommodation3_1.avif'
import accommodationImg3_2 from './Room/accommodation3_2.jpeg'
import accommodationImg3_3 from './Room/accommodation3_3.avif'
import accommodationImg4_1 from './Room/accommodation4_1.jpeg'
import accommodationImg4_2 from './Room/accommodation4_2.jpeg'
import accommodationImg4_3 from './Room/accommodation4_3.jpeg'
import accommodationImg4_4 from './Room/accommodation4_4.jpeg'
import accommodationImg5_1 from './Room/accommodation5_1.jpeg'
import accommodationImg5_2 from './Room/accommodation5_2.avif'
import accommodationImg5_3 from './Room/accommodation5_3.jpeg'
import accommodationImg5_4 from './Room/accommodation5_4.jpeg'
import accommodationImg6_1 from './Room/accommodation6_1.jpg'
import accommodationImg6_2 from './Room/accommodation6_2.jpg'
import accommodationImg6_3 from './Room/accommodation6_3.jpg'
import accommodationImg6_4 from './Room/accommodation6_4.jpg'
import accommodationImg7_1 from './Room/accommodation7_1.avif'
import accommodationImg7_2 from './Room/accommodation7_2.jpg'
import accommodationImg7_3 from './Room/accommodation7_3.jpg'
import accommodationImg7_4 from './Room/accommodation7_4.jpg'
import accommodationImg8_1 from './Room/accommodation8_1.avif'
import accommodationImg8_2 from './Room/accommodation8_2.avif'
import accommodationImg8_3 from './Room/accommodation8_3.jpeg'
import accommodationImg8_4 from './Room/accommodation8_4.jpeg'
import accommodationImg9_1 from './Room/accommodation9_1.avif'
import accommodationImg9_2 from './Room/accommodation9_2.jpeg'
import accommodationImg9_3 from './Room/accommodation9_3.jpeg'
import accommodationImg9_4 from './Room/accommodation9_4.jpeg'
import accommodationImg10_1 from './Room/accommodation10_1.jpg'
import accommodationImg10_2 from './Room/accommodation10_2.jpg'
import accommodationImg10_3 from './Room/accommodation10_3.jpg'
import accommodationImg10_4 from './Room/accommodation10_4.jpg'
import accommodationImg11_1 from './Room/accommodation11_1.jpg'
import accommodationImg11_2 from './Room/accommodation11_2.jpg'
import accommodationImg11_3 from './Room/accommodation11_3.jpg'
import accommodationImg11_4 from './Room/accommodation11_4.jpg'


export const assets = {
  closeIcon,
  locationIcon
}


export const lecturerData = [
  {
    _id: "lecturer_1",
    username: "Dr. Nimal Perera",
    phone: "+94771239870",
    email: "nimal.perera@university.edu",
    role: "Lecturer",
    Department: "Computer Science",
    City: "Colombo",
    creatDate: "2025-07-17",
  },
];

export const studentData = [
  {
    _id: "student_01",
    displayNamename: "Puvanakopis",
    phone: "+94771234567",
    email: "puvanakopis@gmail.com",
    role: "Student",
    fullName: "Mr. Senaka Perera",
    profile_pic: "",
    PhoneNumber: "0774584052",
    address: "No. 65, Main Street, Pambahinna, Balangoda",
    creatDate: "2025-06-17",
  },
];

export const ownerData = [
  {
    id: "owner_01",
    FullName: "Mr. Senaka Perera",
    DisplayName: "Senaka",
    profile_pic: "https://ui-avatars.com/api/?name=Senaka+Perera&background=0D8ABC&color=fff",
    PhoneNumber: "0774584052",
    Address: "No. 45, Main Street, Pambahinna, Balangoda",
    email: "senaka@gmail.com",
    role: "Owner",
    verified: true,
    Status: "Active",
    totalReviews: 150,
    averageRating: 4,
    ratingCount: {
      "1": 10,
      "2": 5,
      "3": 10,
      "4": 15,
      "5": 110
    },
    creatDate: "2025-07-17",
    bankDetails: {
      accountNumber: "1234567890",
      bankName: "Bank of Ceylon",
      branch: "Balangoda"
    }
  },
  {
    id: "owner_02",
    FullName: "Ms. Nimali Fernando",
    DisplayName: "Nimali",
    profile_pic: "https://ui-avatars.com/api/?name=Nimali+Fernando&background=FF6B6B&color=fff",
    PhoneNumber: "0712345678",
    Address: "No. 12, Lake Road, Kandy",
    email: "nimali.f@gmail.com",
    role: "Owner",
    verified: true,
    Status: "Blocked",
    totalReviews: 85,
    averageRating: 4.5,
    ratingCount: {
      "1": 2,
      "2": 3,
      "3": 10,
      "4": 20,
      "5": 50
    },
    creatDate: "2025-07-17",
    bankDetails: {
      accountNumber: "0987654321",
      bankName: "People's Bank",
      branch: "Kandy"
    }
  }
];




export const accommodationsData = [
  {
    _id: "accommodation_01",
    accommodationName: "Cozy Single Bed Accommodation",
    owner: ownerData[0],
    accommodationType: "Single Bed",
    pricePerMonth: 6000,
    SecurityDeposit: 10000,
    amenities: ["Wi-Fi", "Study Table", "Shared Kitchen"],
    images: [accommodationImg1_1, accommodationImg1_2, accommodationImg1_3, accommodationImg1_4],
    isAvailable: true,
    location: "Near Sabaragamuwa University, Belihuloya, Sri Lanka",
    noOfBed: 1,
    description: "A comfortable single-bed accommodation ideal for Sabaragamuwa University students, featuring Wi-Fi, study table, and shared kitchen. Conveniently located within walking distance of the campus.",
    totalReviews: 150,
    averageRating: 3,
    ratingCount: {
      "1": 10,
      "2": 5,
      "3": 10,
      "4": 15,
      "5": 110
    },
    creatDate: "2025-06-10",
    Status: "Blocked",
  },
  {
    _id: "accommodation_02",
    accommodationName: "Spacious Double Bed Accommodation",
    owner: ownerData[1],
    accommodationType: "Double Bed",
    pricePerMonth: 9000,
    SecurityDeposit: 15000,
    amenities: ["Wi-Fi", "Private Bathaccommodation", "Balcony", "Shared Kitchen"],
    images: [accommodationImg2_1, accommodationImg2_2, accommodationImg2_3, accommodationImg2_4],
    isAvailable: true,
    location: "1 km from Sabaragamuwa University, Belihuloya, Sri Lanka",
    noOfBed: 2,
    description: "A large, well-lit double-bed accommodation perfect for accommodationmates, offering a private bathaccommodation, balcony, and high-speed Wi-Fi. Easy access to public transport and local shops.",
    totalReviews: 85,
    averageRating: 4,
    ratingCount: {
      "1": 4,
      "2": 3,
      "3": 10,
      "4": 20,
      "5": 48
    },
    creatDate: "2025-06-15",
  },
  {
    _id: "accommodation_03",
    accommodationName: "Budget-Friendly Single Accommodation",
    owner: ownerData[2],
    accommodationType: "Single Bed",
    pricePerMonth: 4500,
    SecurityDeposit: 8000,
    amenities: ["Wi-Fi", "Study Table", "Fan", "Shared Bathaccommodation"],
    images: [accommodationImg3_1, accommodationImg3_2, accommodationImg3_3],
    isAvailable: false,
    location: "500 meters from Sabaragamuwa University, Belihuloya, Sri Lanka",
    noOfBed: 1,
    description: "Affordable single-bed accommodation with basic amenities and a quiet study space. Suitable for budget-conscious students seeking proximity to campus.",
    totalReviews: 60,
    averageRating: 3.8,
    ratingCount: {
      "1": 5,
      "2": 5,
      "3": 12,
      "4": 18,
      "5": 20
    },
    creatDate: "2025-06-17",
  },
  {
    _id: "accommodation_04",
    accommodationName: "Premium Shared Accommodation",
    owner: ownerData[3],
    accommodationType: "Annexe",
    pricePerMonth: 15000,
    SecurityDeposit: 20000,
    amenities: ["Wi-Fi", "Air Conditioning", "Private Bathaccommodation", "Mini Kitchen", "Balcony"],
    images: [accommodationImg4_1, accommodationImg4_2, accommodationImg4_3, accommodationImg4_4],
    isAvailable: true,
    location: "Near Pambahinna, Belihuloya, Sri Lanka",
    noOfBed: 1,
    description: "Modern studio apartment with a private kitchen and balcony, ideal for students wanting extra comfort and privacy. Fully furnished and close to university facilities.",
    totalReviews: 45,
    averageRating: 4.7,
    ratingCount: {
      "1": 1,
      "2": 1,
      "3": 3,
      "4": 10,
      "5": 30
    },
    creatDate: "2025-07-09",
  }, {
    _id: "accommodation_05",
    accommodationName: "Budget Single Accommodation",
    owner: ownerData[1],
    accommodationType: "Single Bed",
    pricePerMonth: 4500,
    SecurityDeposit: 8000,
    amenities: ["Wi-Fi", "Shared Bathaccommodation", "Shared Kitchen"],
    images: [accommodationImg5_1, accommodationImg5_2, accommodationImg5_3, accommodationImg5_4],
    isAvailable: true,
    location: "Near University Gate, Pambahinna, Sri Lanka",
    noOfBed: 1,
    description: "Affordable single bed accommodation with shared facilities, ideal for budget-conscious students. Close to public transport.",
    totalReviews: 20,
    averageRating: 4.2,
    ratingCount: {
      "1": 0,
      "2": 1,
      "3": 4,
      "4": 9,
      "5": 6
    },
    creatDate: "2025-07-10",
  },
  {
    _id: "accommodation_06",
    accommodationName: "Twin Sharing Accommodation",
    owner: ownerData[2],
    accommodationType: "Double Bed",
    pricePerMonth: 7000,
    SecurityDeposit: 10000,
    amenities: ["Wi-Fi", "Study Table", "Shared Bathaccommodation", "Balcony"],
    images: [accommodationImg6_1, accommodationImg6_2, accommodationImg6_3, accommodationImg6_4],
    isAvailable: false,
    location: "Pambahinna Town, Sri Lanka",
    noOfBed: 2,
    description: "Spacious twin sharing accommodation with balcony access. Suitable for friends or classmates looking to share costs.",
    totalReviews: 32,
    averageRating: 4.5,
    ratingCount: {
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 10,
      "5": 16
    },
    creatDate: "2025-07-14",
  },
  {
    _id: "accommodation_07",
    accommodationName: "Luxury Apartment",
    owner: ownerData[4],
    accommodationType: "Triple Sharing",
    pricePerMonth: 25000,
    SecurityDeposit: 30000,
    amenities: ["Wi-Fi", "Air Conditioning", "Private Bathaccommodation", "Kitchen", "Balcony", "Laundry"],
    images: [accommodationImg7_1, accommodationImg7_2, accommodationImg7_3, accommodationImg7_4],
    isAvailable: true,
    location: "Belihuloya Lake View, Sri Lanka",
    noOfBed: 2,
    description: "High-end apartment with a scenic view, perfect for students who prefer a premium lifestyle. Fully equipped kitchen and laundry.",
    totalReviews: 55,
    averageRating: 4.9,
    ratingCount: {
      "1": 0,
      "2": 0,
      "3": 2,
      "4": 8,
      "5": 45
    },
    creatDate: "2025-07-15",
  },
  {
    _id: "accommodation_08",
    accommodationName: "Cozy Shared Accommodation",
    owner: ownerData[0],
    accommodationType: "Triple Sharing",
    pricePerMonth: 5000,
    SecurityDeposit: 7000,
    amenities: ["Wi-Fi", "Shared Bathaccommodation", "Shared Kitchen"],
    images: [accommodationImg8_1, accommodationImg8_2, accommodationImg8_3, accommodationImg8_4],
    isAvailable: true,
    location: "Near Bus Stand, Pambahinna, Sri Lanka",
    noOfBed: 2,
    description: "Comfortable shared accommodation for two, close to shops and the bus stand. Affordable and convenient for students.",
    totalReviews: 18,
    averageRating: 4.1,
    ratingCount: {
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 8,
      "5": 4
    },
    creatDate: "2025-07-16",
  },
  {
    _id: "accommodation_09",
    accommodationName: "Family-style Apartment",
    owner: ownerData[5],
    accommodationType: "Double Bed",
    pricePerMonth: 18000,
    SecurityDeposit: 20000,
    amenities: ["Wi-Fi", "Private Bathaccommodation", "Kitchen", "Balcony", "Washing Machine"],
    images: [accommodationImg9_1, accommodationImg9_2, accommodationImg9_3, accommodationImg9_4],
    isAvailable: false,
    location: "Belihuloya Main Road, Sri Lanka",
    noOfBed: 3,
    description: "Spacious apartment ideal for small student groups or friends. Fully furnished with modern facilities.",
    totalReviews: 40,
    averageRating: 4.6,
    ratingCount: {
      "1": 1,
      "2": 1,
      "3": 3,
      "4": 12,
      "5": 23
    },
    creatDate: "2025-07-17",
  },
  {
    _id: "accommodation_10",
    accommodationName: "Compact Double Bed",
    owner: ownerData[6],
    accommodationType: "Double Bed",
    pricePerMonth: 12000,
    SecurityDeposit: 15000,
    amenities: ["Wi-Fi", "Air Conditioning", "Private Bathaccommodation", "Mini Kitchen"],
    images: [accommodationImg10_1, accommodationImg10_2, accommodationImg10_3, accommodationImg10_4],
    isAvailable: true,
    location: "Near University Playground, Pambahinna, Sri Lanka",
    noOfBed: 1,
    description: "Small but modern studio for single occupancy. Close to sports facilities and university buildings.",
    totalReviews: 27,
    averageRating: 4.4,
    ratingCount: {
      "1": 0,
      "2": 2,
      "3": 4,
      "4": 10,
      "5": 11
    },
    creatDate: "2025-07-18",
  },
  {
    _id: "accommodation_11",
    accommodationName: "Eco-friendly Accommodation",
    owner: ownerData[2],
    accommodationType: "Single Bed",
    pricePerMonth: 5500,
    SecurityDeposit: 9000,
    amenities: ["Wi-Fi", "Shared Bathaccommodation", "Solar Power", "Garden View"],
    images: [accommodationImg11_1, accommodationImg11_2, accommodationImg11_3, accommodationImg11_4],
    isAvailable: true,
    location: "Green Area, Belihuloya, Sri Lanka",
    noOfBed: 1,
    description: "Environmentally friendly accommodation with solar-powered electricity and a beautiful garden view. Peaceful and quiet.",
    totalReviews: 15,
    averageRating: 4.3,
    ratingCount: {
      "1": 1,
      "2": 0,
      "3": 2,
      "4": 6,
      "5": 6
    },
    creatDate: "2025-07-21",
  }


];



// ------------- transport

export const vehicleData = [
  {
    vehicle_id: "vehicle_01",
    owner: ownerData[0],
    vehicle_type: "Motorbike",
    brand: "Honda",
    model: "CBR 500R",
    fuel_type: "Petrol",
    seating_capacity: 2,
    year: 2019,
    registration_number: "WP-1234",
    rental_price_per_day: 1500,
    deposit_amount: 10000,
    features: ["Air Conditioning", "Automatic Transmission", "Hybrid Engine", "Bluetooth Audio"],
    vehicle_images: [accommodationImg1, accommodationImg2, accommodationImg3, accommodationImg4],
    address: "Ratnapura, Sabaragamuwa",
    description: "A fuel-efficient and comfortable Toyota Prius Hybrid perfect for students and faculty for short trips or daily use. Comes with air conditioning, Bluetooth audio, and ample luggage space.",
    totalReviews: 80,
    averageRating: 4,
    ratingCount: {
      "1": 2,
      "2": 3,
      "3": 5,
      "4": 20,
      "5": 50
    },
    isAvailable: true,
    creatDate: "2025-07-11",
  },
  {
    vehicle_id: "vehicle_02",
    owner: ownerData[0],
    vehicle_type: "Motorbike",
    brand: "Honda",
    model: "CBR 500R",
    fuel_type: "Petrol",
    seating_capacity: 2,
    year: 2019,
    registration_number: "WP-1234",
    rental_price_per_day: 1500,
    deposit_amount: 10000,
    features: ["Air Conditioning", "Automatic Transmission", "Hybrid Engine", "Bluetooth Audio"],
    vehicle_images: [accommodationImg1, accommodationImg2, accommodationImg3, accommodationImg4],
    address: "Ratnapura, Sabaragamuwa",
    description: "A fuel-efficient and comfortable Toyota Prius Hybrid perfect for students and faculty for short trips or daily use. Comes with air conditioning, Bluetooth audio, and ample luggage space.",
    totalReviews: 80,
    averageRating: 4,
    ratingCount: {
      "1": 2,
      "2": 3,
      "3": 5,
      "4": 20,
      "5": 50
    },
    isAvailable: true,
    creatDate: "2025-07-17",

  },
  {
    vehicle_id: "vehicle_03",
    owner: ownerData[0],
    vehicle_type: "Motorbike",
    brand: "Honda",
    model: "CBR 500R",
    fuel_type: "Petrol",
    seating_capacity: 2,
    year: 2019,
    registration_number: "WP-1234",
    rental_price_per_day: 1500,
    deposit_amount: 10000,
    features: ["Air Conditioning", "Automatic Transmission", "Hybrid Engine", "Bluetooth Audio"],
    vehicle_images: [accommodationImg1, accommodationImg2, accommodationImg3, accommodationImg4],
    address: "Ratnapura, Sabaragamuwa",
    description: "A fuel-efficient and comfortable Toyota Prius Hybrid perfect for students and faculty for short trips or daily use. Comes with air conditioning, Bluetooth audio, and ample luggage space.",
    totalReviews: 80,
    averageRating: 4,
    ratingCount: {
      "1": 2,
      "2": 3,
      "3": 5,
      "4": 20,
      "5": 50
    },
    isAvailable: true,
    creatDate: "2025-07-15",

  },
  {
    vehicle_id: "vehicle_04",
    owner: ownerData[0],
    vehicle_type: "Motorbike",
    brand: "Honda",
    model: "CBR 500R",
    fuel_type: "Petrol",
    seating_capacity: 2,
    year: 2019,
    registration_number: "WP-1234",
    rental_price_per_day: 1500,
    deposit_amount: 10000,
    features: ["Air Conditioning", "Automatic Transmission", "Hybrid Engine", "Bluetooth Audio"],
    vehicle_images: [accommodationImg1, accommodationImg2, accommodationImg3, accommodationImg4],
    address: "Ratnapura, Sabaragamuwa",
    description: "A fuel-efficient and comfortable Toyota Prius Hybrid perfect for students and faculty for short trips or daily use. Comes with air conditioning, Bluetooth audio, and ample luggage space.",
    totalReviews: 80,
    averageRating: 4,
    ratingCount: {
      "1": 2,
      "2": 3,
      "3": 5,
      "4": 20,
      "5": 50
    },
    isAvailable: true,
    creatDate: "2025-07-20",
  },
];




export const upcomingBookings = {
  accommodationBookings: [
    {
      _id: "accommodationbooking_01",
      accommodation: accommodationsData[0],
      renter: studentData[0],
      owner: ownerData[0],
      booking_start: "2025-08-15",
      booking_end: "2025-08-20",
      totalPrice: 45000,
      booking_status: "confirmed",
      isPaid: true
    },
  ],
  vehicleBookings: [
    {
      _id: "vehiclebooking_01",
      renter: studentData[0],
      vehicle: vehicleData[0],
      owner: ownerData[0],
      booking_start: "2023-12-18",
      booking_end: "2023-12-22",
      totalPrice: 18000,
      booking_status: "confirmed",
      isPaid: true
    },
  ]
};



export const pastBookings = {
  accommodationBookings: [
    {
      _id: "accommodationbooking_02",
      accommodation: accommodationsData[1],
      renter: studentData[0],
      owner: ownerData[1],
      booking_start: "2025-06-10",
      booking_end: "2025-06-15",
      totalPrice: 20000,
      booking_status: "completed",
      isPaid: true,
      rating: 4,
      feedback: "Great stay, would book again!"
    },
    {
      _id: "accommodationbooking_03",
      accommodation: accommodationsData[1],
      renter: studentData[0],
      owner: ownerData[1],
      booking_start: "2025-06-10",
      booking_end: "2025-06-15",
      totalPrice: 21000,
      booking_status: "cancelled",
      isPaid: false,
      rating: 4,
      feedback: "Great stay, would book again!"
    },
  ],
  vehicleBookings: [
    {
      _id: "vehiclebooking_02",
      renter: studentData[1],
      vehicle: vehicleData[1],
      owner: ownerData[2],
      booking_start: "2025-05-20",
      booking_end: "2025-05-25",
      totalPrice: 25000,
      booking_status: "cancelled",
      isPaid: false,
      rating: 5,
      feedback: "Excellent vehicle, very reliable"
    },
    {
      _id: "vehiclebooking_04",
      renter: studentData[1],
      vehicle: vehicleData[1],
      owner: ownerData[2],
      booking_start: "2025-05-20",
      booking_end: "2025-05-25",
      totalPrice: 25000,
      booking_status: "completed",
      isPaid: true,
      rating: 5,
      feedback: "Excellent vehicle, very reliable"
    },
    {
      _id: "vehiclebooking_03",
      renter: studentData[2],
      vehicle: vehicleData[0],
      owner: ownerData[2],
      booking_start: "2025-05-20",
      booking_end: "2025-05-25",
      totalPrice: 25000,
      booking_status: "cancelled",
      isPaid: false,
      rating: 5,
      feedback: "Excellent vehicle, very reliable"
    },
  ]
};



export default {
  lecturerData,
  studentData,
  ownerData,
  accommodationsData,
  vehicleData,
  upcomingBookings,
  pastBookings
};