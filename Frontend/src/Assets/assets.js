import closeIcon from './closeIcon.svg'
import locationIcon from './Accommodation/locationIcon.svg'

import roomImg1 from './Room/room1_1.avif'
import roomImg2 from './Room/room1_2.avif'
import roomImg3 from './Room/room1_3.jpeg'
import roomImg4 from './Room/room1_4.avif'

import roomImg1_1 from './Room/room1_1.avif'
import roomImg1_2 from './Room/room1_2.avif'
import roomImg1_3 from './Room/room1_3.jpeg'
import roomImg1_4 from './Room/room1_4.avif'
import roomImg2_1 from './Room/room2_1.avif'
import roomImg2_2 from './Room/room2_2.jpeg'
import roomImg2_3 from './Room/room2_3.avif'
import roomImg2_4 from './Room/room2_4.jpeg'
import roomImg3_1 from './Room/room3_1.avif'
import roomImg3_2 from './Room/room3_2.jpeg'
import roomImg3_3 from './Room/room3_3.avif'
import roomImg4_1 from './Room/room4_1.jpeg'
import roomImg4_2 from './Room/room4_2.jpeg'
import roomImg4_3 from './Room/room4_3.jpeg'
import roomImg4_4 from './Room/room4_4.jpeg'
import roomImg5_1 from './Room/room5_1.jpeg'
import roomImg5_2 from './Room/room5_2.avif'
import roomImg5_3 from './Room/room5_3.jpeg'
import roomImg5_4 from './Room/room5_4.jpeg'
import roomImg6_1 from './Room/room6_1.jpg'
import roomImg6_2 from './Room/room6_2.jpg'
import roomImg6_3 from './Room/room6_3.jpg'
import roomImg6_4 from './Room/room6_4.jpg'
import roomImg7_1 from './Room/room7_1.avif'
import roomImg7_2 from './Room/room7_2.jpg'
import roomImg7_3 from './Room/room7_3.jpg'
import roomImg7_4 from './Room/room7_4.jpg'
import roomImg8_1 from './Room/room8_1.avif'
import roomImg8_2 from './Room/room8_2.avif'
import roomImg8_3 from './Room/room8_3.jpeg'
import roomImg8_4 from './Room/room8_4.jpeg'
import roomImg9_1 from './Room/room9_1.avif'
import roomImg9_2 from './Room/room9_2.jpeg'
import roomImg9_3 from './Room/room9_3.jpeg'
import roomImg9_4 from './Room/room9_4.jpeg'
import roomImg10_1 from './Room/room10_1.jpg'
import roomImg10_2 from './Room/room10_2.jpg'
import roomImg10_3 from './Room/room10_3.jpg'
import roomImg10_4 from './Room/room10_4.jpg'
import roomImg11_1 from './Room/room11_1.jpg'
import roomImg11_2 from './Room/room11_2.jpg'
import roomImg11_3 from './Room/room11_3.jpg'
import roomImg11_4 from './Room/room11_4.jpg'


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




export const roomsData = [
  {
    _id: "room_01",
    roomName: "Cozy Single Bed Room",
    owner: ownerData[0],
    roomType: "Single Bed",
    pricePerMonth: 6000,
    SecurityDeposit: 10000,
    amenities: ["Wi-Fi", "Study Table", "Shared Kitchen"],
    images: [roomImg1_1, roomImg1_2, roomImg1_3, roomImg1_4],
    isAvailable: true,
    location: "Near Sabaragamuwa University, Belihuloya, Sri Lanka",
    noOfBed: 1,
    description: "A comfortable single-bed room ideal for Sabaragamuwa University students, featuring Wi-Fi, study table, and shared kitchen. Conveniently located within walking distance of the campus.",
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
    _id: "room_02",
    roomName: "Spacious Double Bed Room",
    owner: ownerData[1],
    roomType: "Double Bed",
    pricePerMonth: 9000,
    SecurityDeposit: 15000,
    amenities: ["Wi-Fi", "Private Bathroom", "Balcony", "Shared Kitchen"],
    images: [roomImg2_1, roomImg2_2, roomImg2_3, roomImg2_4],
    isAvailable: true,
    location: "1 km from Sabaragamuwa University, Belihuloya, Sri Lanka",
    noOfBed: 2,
    description: "A large, well-lit double-bed room perfect for roommates, offering a private bathroom, balcony, and high-speed Wi-Fi. Easy access to public transport and local shops.",
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
    _id: "room_03",
    roomName: "Budget-Friendly Single Room",
    owner: ownerData[2],
    roomType: "Single Bed",
    pricePerMonth: 4500,
    SecurityDeposit: 8000,
    amenities: ["Wi-Fi", "Study Table", "Fan", "Shared Bathroom"],
    images: [roomImg3_1, roomImg3_2, roomImg3_3],
    isAvailable: false,
    location: "500 meters from Sabaragamuwa University, Belihuloya, Sri Lanka",
    noOfBed: 1,
    description: "Affordable single-bed room with basic amenities and a quiet study space. Suitable for budget-conscious students seeking proximity to campus.",
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
    _id: "room_04",
    roomName: "Premium Shared Room",
    owner: ownerData[3],
    roomType: "Annexe",
    pricePerMonth: 15000,
    SecurityDeposit: 20000,
    amenities: ["Wi-Fi", "Air Conditioning", "Private Bathroom", "Mini Kitchen", "Balcony"],
    images: [roomImg4_1, roomImg4_2, roomImg4_3, roomImg4_4],
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
    _id: "room_05",
    roomName: "Budget Single Room",
    owner: ownerData[1],
    roomType: "Single Bed",
    pricePerMonth: 4500,
    SecurityDeposit: 8000,
    amenities: ["Wi-Fi", "Shared Bathroom", "Shared Kitchen"],
    images: [roomImg5_1, roomImg5_2, roomImg5_3, roomImg5_4],
    isAvailable: true,
    location: "Near University Gate, Pambahinna, Sri Lanka",
    noOfBed: 1,
    description: "Affordable single bed room with shared facilities, ideal for budget-conscious students. Close to public transport.",
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
    _id: "room_06",
    roomName: "Twin Sharing Room",
    owner: ownerData[2],
    roomType: "Double Bed",
    pricePerMonth: 7000,
    SecurityDeposit: 10000,
    amenities: ["Wi-Fi", "Study Table", "Shared Bathroom", "Balcony"],
    images: [roomImg6_1, roomImg6_2, roomImg6_3, roomImg6_4],
    isAvailable: false,
    location: "Pambahinna Town, Sri Lanka",
    noOfBed: 2,
    description: "Spacious twin sharing room with balcony access. Suitable for friends or classmates looking to share costs.",
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
    _id: "room_07",
    roomName: "Luxury Apartment",
    owner: ownerData[4],
    roomType: "Triple Sharing",
    pricePerMonth: 25000,
    SecurityDeposit: 30000,
    amenities: ["Wi-Fi", "Air Conditioning", "Private Bathroom", "Kitchen", "Balcony", "Laundry"],
    images: [roomImg7_1, roomImg7_2, roomImg7_3, roomImg7_4],
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
    _id: "room_08",
    roomName: "Cozy Shared Room",
    owner: ownerData[0],
    roomType: "Triple Sharing",
    pricePerMonth: 5000,
    SecurityDeposit: 7000,
    amenities: ["Wi-Fi", "Shared Bathroom", "Shared Kitchen"],
    images: [roomImg8_1, roomImg8_2, roomImg8_3, roomImg8_4],
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
    _id: "room_09",
    roomName: "Family-style Apartment",
    owner: ownerData[5],
    roomType: "Double Bed",
    pricePerMonth: 18000,
    SecurityDeposit: 20000,
    amenities: ["Wi-Fi", "Private Bathroom", "Kitchen", "Balcony", "Washing Machine"],
    images: [roomImg9_1, roomImg9_2, roomImg9_3, roomImg9_4],
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
    _id: "room_10",
    roomName: "Compact Double Bed",
    owner: ownerData[6],
    roomType: "Double Bed",
    pricePerMonth: 12000,
    SecurityDeposit: 15000,
    amenities: ["Wi-Fi", "Air Conditioning", "Private Bathroom", "Mini Kitchen"],
    images: [roomImg10_1, roomImg10_2, roomImg10_3, roomImg10_4],
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
    _id: "room_11",
    roomName: "Eco-friendly Room",
    owner: ownerData[2],
    roomType: "Single Bed",
    pricePerMonth: 5500,
    SecurityDeposit: 9000,
    amenities: ["Wi-Fi", "Shared Bathroom", "Solar Power", "Garden View"],
    images: [roomImg11_1, roomImg11_2, roomImg11_3, roomImg11_4],
    isAvailable: true,
    location: "Green Area, Belihuloya, Sri Lanka",
    noOfBed: 1,
    description: "Environmentally friendly room with solar-powered electricity and a beautiful garden view. Peaceful and quiet.",
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
    vehicle_images: [roomImg1, roomImg2, roomImg3, roomImg4],
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
    vehicle_images: [roomImg1, roomImg2, roomImg3, roomImg4],
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
    vehicle_images: [roomImg1, roomImg2, roomImg3, roomImg4],
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
    vehicle_images: [roomImg1, roomImg2, roomImg3, roomImg4],
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
  roomBookings: [
    {
      _id: "roombooking_01",
      room: roomsData[0],
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
  roomBookings: [
    {
      _id: "roombooking_02",
      room: roomsData[1],
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
      _id: "roombooking_03",
      room: roomsData[1],
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
  roomsData,
  vehicleData,
  upcomingBookings,
  pastBookings
};