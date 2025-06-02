import logo from './logo.svg'
import searchIcon from './searchIcon.svg'
import userIcon from './userIcon.svg'
import calenderIcon from './calenderIcon.svg'
import locationIcon from './locationIcon.svg'
import starIconFilled from './starIconFilled.svg'
import arrowIcon from './arrowIcon.svg'
import starIconOutlined from './starIconOutlined.svg'
import instagramIcon from './instagramIcon.svg'
import facebookIcon from './facebookIcon.svg'
import twitterIcon from './twitterIcon.svg'
import linkendinIcon from './linkendinIcon.svg'
import freeWifiIcon from './freeWifiIcon.svg'
import freeBreakfastIcon from './freeBreakfastIcon.svg'
import roomServiceIcon from './roomServiceIcon.svg'
import mountainIcon from './mountainIcon.svg'
import poolIcon from './poolIcon.svg'
import homeIcon from './homeIcon.svg'
import closeIcon from './closeIcon.svg'
import locationFilledIcon from './locationFilledIcon.svg'
import heartIcon from './heartIcon.svg'
import badgeIcon from './badgeIcon.svg'
import menuIcon from './menuIcon.svg'
import closeMenu from './closeMenu.svg'
import guestsIcon from './guestsIcon.svg'
import roomImg1 from './roomImg1.png'
import roomImg2 from './roomImg2.png'
import roomImg3 from './roomImg3.png'
import roomImg4 from './roomImg4.png'
import regImage from './regImage.png'
import addIcon from "./addIcon.svg";
import dashboardIcon from "./dashboardIcon.svg";
import listIcon from "./listIcon.svg";
import uploadArea from "./uploadArea.svg";
import totalBookingIcon from "./totalBookingIcon.svg";
import totalRevenueIcon from "./totalRevenueIcon.svg";


export const assets = {
    logo,
    searchIcon,
    userIcon,
    calenderIcon,
    locationIcon,
    starIconFilled,
    arrowIcon,
    starIconOutlined,
    instagramIcon,
    facebookIcon,
    twitterIcon,
    linkendinIcon,
    freeWifiIcon,
    freeBreakfastIcon,
    roomServiceIcon,
    mountainIcon,
    poolIcon,
    closeIcon,
    homeIcon,
    locationFilledIcon,
    heartIcon,
    badgeIcon,
    menuIcon,
    closeMenu,
    guestsIcon,
    regImage,
    addIcon,
    dashboardIcon,
    listIcon,
    uploadArea,
    totalBookingIcon,
    totalRevenueIcon,
}

// ----------------- studentData -----------------
export const studentData = [
  {
    _id: "student_1",
    username: "Mr. Ruwan Jayasinghe",
    phone: "+94771234567",
    email: "ruwan@gmail.com",
    role: "Student",
    City: "Belihuloya",
  },
  {
    _id: "student_2",
    username: "Ms. Nadeesha Perera",
    phone: "+94771239876",
    email: "nadeesha.perera@gmail.com",
    role: "Student",
    City: "Colombo",
  },
  {
    _id: "student_3",
    username: "Mr. Kusal Fernando",
    phone: "+94771233456",
    email: "kusal.fernando@gmail.com",
    role: "Student",
    City: "Kandy",
  },
  {
    _id: "student_4",
    username: "Ms. Ishara Wijesinghe",
    phone: "+94771236789",
    email: "ishara.wijesinghe@gmail.com",
    role: "Student",
    City: "Galle",
  },
  {
    _id: "student_5",
    username: "Mr. Thilina Senanayake",
    phone: "+94771231234",
    email: "thilina.sena@gmail.com",
    role: "Student",
    City: "Jaffna",
  },
  {
    _id: "student_6",
    username: "Ms. Sanduni Perera",
    phone: "+94771234512",
    email: "sanduni.perera@gmail.com",
    role: "Student",
    City: "Matara",
  },
];

// ----------------- lecturerData -----------------
export const lecturerData = [
  {
    _id: "lecturer_1",
    username: "Dr. Nimal Perera",
    phone: "+94771239870",
    email: "nimal.perera@university.edu",
    role: "Lecturer",
    Department: "Computer Science",
    City: "Colombo",
  },
  {
    _id: "lecturer_2",
    username: "Prof. Kamala Wijeratne",
    phone: "+94771235432",
    email: "kamala.wijeratne@university.edu",
    role: "Lecturer",
    Department: "Electrical Engineering",
    City: "Kandy",
  },
  {
    _id: "lecturer_3",
    username: "Dr. Sunil Gunasekara",
    phone: "+94771236789",
    email: "sunil.gunasekara@university.edu",
    role: "Lecturer",
    Department: "Mechanical Engineering",
    City: "Galle",
  },
  {
    _id: "lecturer_4",
    username: "Prof. Ishani Jayawardena",
    phone: "+94771230123",
    email: "ishani.jayawardena@university.edu",
    role: "Lecturer",
    Department: "Civil Engineering",
    City: "Jaffna",
  },
];




// ----------------- User Data 


export const hotelOwnerData = [
    // hotel Owner
    {
        _id: "hotelOwner_1",
        username: "Mr. Senaka Perera",
        email: "senaka@gmail.com",
        role: "hotelOwner",
        City: ["Pambahinna"]
    },
    {
        _id: "hotelOwner_2",
        username: "Mrs. Kusum Fernando",
        email: "kusum@gmail.com",
        role: "hotelOwner",
        City: ["Belihuloya"]
    },
    {
        _id: "hotelOwner_3",
        username: "Mr. Dilshan Kumara",
        email: "dilshan@gmail.com",
        role: "hotelOwner",
        City: ["Kumbalgamuwa"]
    },
    {
        _id: "hotelOwner_4",
        username: "Mrs. Tharushi Nisansala",
        email: "tharushi@gmail.com",
        role: "hotelOwner",
        City: ["Pambahinna"]
    },
    {
        _id: "hotelOwner_5",
        username: "Mr. Ruwan Jayasinghe",
        email: "ruwan@gmail.com",
        role: "hotelOwner",
        City: ["Belihuloya"]
    },
]




// ----------------- Accomantation Data -----------------


// ----------------- Hotel Data 
export const hotelData = [
    {
        _id: "hotel_1",
        name: "Landa Villa",
        address: "Near Sabaragamuwa University Main Entrance, Pambahinna",
        city: "Pambahinna",
        contact: "+94781234567",
        amenities: ["Wi-Fi", "Study Table", "Laundry Service", "Meal Plan"]
    },
    {
        _id: "hotel_2",
        name: "GreenHill Boarding",
        address: "Uggalduwa Road, 200m from Uni North Gate, Pambahinna",
        city: "Pambahinna",
        contact: "+94782345678",
        amenities: ["Proximity to Campus", "Shared Kitchen", "Wi-Fi", "24/7 Water"]
    },
    {
        _id: "hotel_3",
        name: "Lakeview Residence",
        address: "Opposite University Hostel Complex, Belihuloya",
        city: "Belihuloya",
        contact: "+94783456789",
        amenities: ["Lake View", "Transport Facility", "Study Desk", "Free Wi-Fi"]
    },
    {
        _id: "hotel_4",
        name: "Mountain Breeze Inn",
        address: "Hilltop Lane, behind Engineering Faculty, Pambahinna",
        city: "Pambahinna",
        contact: "+94784567890",
        amenities: ["Canteen Access", "Quiet Environment", "Wi-Fi", "Hot Water"]
    },
    {
        _id: "hotel_5",
        name: "Student Stayover",
        address: "Hostel Road, next to Medical Centre, Kumbalgamuwa",
        city: "Kumbalgamuwa",
        contact: "+94785678901",
        amenities: ["Monthly Rent", "Affordable Meals", "Study Area", "Wi-Fi"]
    },
    {
        _id: "hotel_6",
        name: "Serene Villas",
        address: "Temple Road, close to STH Department, Belihuloya",
        city: "Belihuloya",
        contact: "+94786789012",
        amenities: ["Power Backup", "Attached Bathroom", "Laundry", "Wi-Fi"]
    },
    {
        _id: "hotel_7",
        name: "Hilltop Cottages",
        address: "Hill View Lane, near Faculty of Management, Pambahinna",
        city: "Pambahinna",
        contact: "+94787890123",
        amenities: ["Transport Access", "Study Friendly", "Shared Rooms", "Wi-Fi"]
    },
    {
        _id: "hotel_8",
        name: "Campus Comforts",
        address: "University Road, opposite Lecture Hall Complex, Pambahinna",
        city: "Pambahinna",
        contact: "+94788901234",
        amenities: ["Near Campus", "Study Lounge", "Laundry", "Free Wi-Fi"]
    }
]

// ----------------- Rooms Data
export const roomsData = [
    {
        _id: "room_1",
        hotel: hotelData[0],
        roomType: "Single Bed",
        pricePerMonth: 3000,
        amenities: ["Wi-Fi", "Study Table", "Shared Kitchen"],
        images: [roomImg1, roomImg2, roomImg3, roomImg4],
        isAvailable: true
    },
    {
        _id: "room_2",
        hotel: hotelData[0],
        roomType: "Double Bed",
        pricePerMonth: 6000,
        amenities: ["Wi-Fi", "Attached Bathroom", "Wardrobe"],
        images: [roomImg1, roomImg2, roomImg3, roomImg4],
        isAvailable: true
    },
    {
        _id: "room_3",
        hotel: hotelData[0],
        roomType: "Triple Sharing",
        pricePerMonth: 6500,
        amenities: ["Study Table", "Shared Kitchen", "Laundry"],
        images: [roomImg1, roomImg2, roomImg3, roomImg4],
        isAvailable: true
    },
    {
        _id: "room_4",
        hotel: hotelData[1],
        roomType: "Annexe",
        pricePerMonth: 9000,
        amenities: ["Wi-Fi", "Private Entrance", "Mini Fridge"],
        images: [roomImg1, roomImg2, roomImg3, roomImg4],
        isAvailable: true
    },
    {
        _id: "room_5",
        hotel: hotelData[1],
        roomType: "Single Bed",
        pricePerMonth: 4500,
        amenities: ["Fan", "Study Table", "Wi-Fi"],
        images: [roomImg1, roomImg2, roomImg3, roomImg4],
        isAvailable: true
    },

]



// User Bookings Data
export const accommodationBookingsData = [
    {
        _id: "H_Book_1",
        user: studentData[0],
        room: roomsData[1],
        hotel: hotelData,
        checkInDate: "2025-04-30T00:00:00.000Z",
        checkOutDate: "2025-05-01T00:00:00.000Z",
        totalPrice: 1000,
        status: "pending",
        paymentMethod: "Stripe",
        isPaid: true,
        createdAt: "2025-04-10T06:42:01.529Z",
        updatedAt: "2025-04-10T06:43:54.520Z",
    },
    {
        _id: "H_Book_2",
        user: studentData[0],
        room: roomsData[0],
        hotel: hotelData,
        checkInDate: "2025-04-27T00:00:00.000Z",
        checkOutDate: "2025-04-28T00:00:00.000Z",
        totalPrice: 1000,
        guests: 1,
        status: "pending",
        paymentMethod: "Pay At Hotel",
        isPaid: false,
        createdAt: "2025-04-10T06:41:45.873Z",
        updatedAt: "2025-04-10T06:41:45.873Z",
    },
    {
        _id: "H_Book_3",
        user: studentData[0],
        room: roomsData[3],
        hotel: hotelData,
        checkInDate: "2025-04-11T00:00:00.000Z",
        checkOutDate: "2025-04-12T00:00:00.000Z",
        totalPrice: 2000,
        guests: 1,
        status: "pending",
        paymentMethod: "Pay At Hotel",
        isPaid: false,
        createdAt: "2025-04-10T06:41:20.501Z",
        updatedAt: "2025-04-10T06:41:20.501Z",
    }
];


// Dashboard Data
export const dashboardAccommodationData = {
    totalBookings: 3,
    totalRevenue: accommodationBookingsData
        .filter(booking => booking.isPaid)
        .reduce((sum, booking) => sum + booking.totalPrice, 0),
    bookings: accommodationBookingsData

}









// ----------------- ownerData -----------------
export const ownerData = [
  {
    owner_id: "Owner_1",
    name: "Mr. Chamara Silva",
    display_name: "Chamara Silva",
    email: "chamara.silva@example.com",
    phone: "+94771231234",
    role: "Owner",
    address: [
      "No. 45, Main Street",
      "Galle Fort",
      "Galle",
      "Sri Lanka",
      "80000",
    ],
  },
  {
    owner_id: "Owner_2",
    name: "Ms. Ishani Jayawardena",
    display_name: "Ishani Jayawardena",
    email: "ishani.jayawardena@example.com",
    phone: "+94771237654",
    role: "Owner",
    address: [
      "No. 12, Lake View Road",
      "Peradeniya",
      "Kandy",
      "Sri Lanka",
      "20000",
    ],
  },
  {
    owner_id: "Owner_3",
    name: "Mr. Nimal Perera",
    display_name: "Nimal Perera",
    email: "nimal.perera@example.com",
    phone: "+94771233445",
    role: "Owner",
    address: [
      "No. 8, Hill Street",
      "Colombo 7",
      "Colombo",
      "Sri Lanka",
      "00700",
    ],
  },
  {
    owner_id: "Owner_4",
    name: "Ms. Kamala Wijeratne",
    display_name: "Kamala Wijeratne",
    email: "kamala.wijeratne@example.com",
    phone: "+94771234567",
    role: "Owner",
    address: [
      "No. 78, Lake Road",
      "Nuwara Eliya",
      "Central Province",
      "Sri Lanka",
      "22200",
    ],
  },
  {
    owner_id: "Owner_5",
    name: "Mr. Sunil Gunasekara",
    display_name: "Sunil Gunasekara",
    email: "sunil.gunasekara@example.com",
    phone: "+94771239876",
    role: "Owner",
    address: [
      "No. 33, Church Street",
      "Jaffna",
      "Northern Province",
      "Sri Lanka",
      "40000",
    ],
  },
];

// ----------------- Vehicle Data -----------------
export const vehicleData = [
  {
    vehicle_id: "vehicle_1",
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
    availability_status: true,
    images: ["roomImg1"],
    average_rating: 4.5,
  },
  {
    vehicle_id: "vehicle_2",
    owner: ownerData[1],
    vehicle_type: "Car",
    brand: "Toyota",
    model: "Corolla",
    fuel_type: "Petrol",
    seating_capacity: 5,
    year: 2018,
    registration_number: "WP-5678",
    rental_price_per_day: 3500,
    deposit_amount: 25000,
    availability_status: true,
    images: ["roomImg2"],
    average_rating: 4.8,
  },
  {
    vehicle_id: "vehicle_3",
    owner: ownerData[2],
    vehicle_type: "Car",
    brand: "Nissan",
    model: "Sunny",
    fuel_type: "Diesel",
    seating_capacity: 5,
    year: 2017,
    registration_number: "WP-8765",
    rental_price_per_day: 3000,
    deposit_amount: 20000,
    availability_status: false,
    images: ["roomImg3"],
    average_rating: 4.1,
  },
  {
    vehicle_id: "vehicle_4",
    owner: ownerData[3],
    vehicle_type: "Van",
    brand: "Suzuki",
    model: "APV",
    fuel_type: "Petrol",
    seating_capacity: 7,
    year: 2020,
    registration_number: "WP-2345",
    rental_price_per_day: 4000,
    deposit_amount: 30000,
    availability_status: true,
    images: ["roomImg4"],
    average_rating: 4.7,
  },
  {
    vehicle_id: "vehicle_5",
    owner: ownerData[4],
    vehicle_type: "Motorbike",
    brand: "Yamaha",
    model: "R15",
    fuel_type: "Petrol",
    seating_capacity: 2,
    year: 2021,
    registration_number: "WP-3456",
    rental_price_per_day: 1800,
    deposit_amount: 12000,
    availability_status: true,
    images: ["roomImg5"],
    average_rating: 4.3,
  },
  {
    vehicle_id: "vehicle_6",
    owner: ownerData[0],
    vehicle_type: "Car",
    brand: "Suzuki",
    model: "Swift",
    fuel_type: "Petrol",
    seating_capacity: 5,
    year: 2019,
    registration_number: "WP-6543",
    rental_price_per_day: 3200,
    deposit_amount: 22000,
    availability_status: false,
    images: ["roomImg6"],
    average_rating: 4.6,
  },
  {
    vehicle_id: "vehicle_7",
    owner: ownerData[1],
    vehicle_type: "Car",
    brand: "Honda",
    model: "Civic",
    fuel_type: "Petrol",
    seating_capacity: 5,
    year: 2022,
    registration_number: "WP-7890",
    rental_price_per_day: 3800,
    deposit_amount: 28000,
    availability_status: true,
    images: ["roomImg7"],
    average_rating: 4.9,
  },
   {
    vehicle_id: "vehicle_8",
    owner: ownerData[2],
    vehicle_type: "Bus",
    brand: "Tata",
    model: "LP 407",
    fuel_type: "Diesel",
    seating_capacity: 30,
    year: 2016,
    registration_number: "WP-9988",
    rental_price_per_day: 7500,
    deposit_amount: 50000,
    availability_status: true,
    images: ["roomImg8"],
    average_rating: 4.2,
  },
  {
    vehicle_id: "vehicle_9",
    owner: ownerData[3],
    vehicle_type: "Bus",
    brand: "Ashok Leyland",
    model: "Viking",
    fuel_type: "Diesel",
    seating_capacity: 40,
    year: 2021,
    registration_number: "WP-7788",
    rental_price_per_day: 9000,
    deposit_amount: 60000,
    availability_status: false,
    images: ["roomImg9"],
    average_rating: 4.4,
  },
];

// ----------------- vehicle Bookings Data -----------------
export const vehicleBookingsData = [
  {
    booking_id: "booking_1",
    renter: studentData[0],
    vehicle: vehicleData[0],
    owner: ownerData[0],
    booking_start: "2025-06-10T08:00:00",
    booking_days: 3,
    booking_status: "Confirmed",
    isPaid: true,
    totalPrice: 3 * 1500,
  },
  {
    booking_id: "booking_2",
    renter: studentData[2],
    vehicle: vehicleData[1],
    owner: ownerData[1],
    booking_start: "2025-06-12T10:00:00",
    booking_days: 5,
    booking_status: "Confirmed",
    isPaid: false,
    totalPrice: 5 * 3500,
  },
  {
    booking_id: "booking_3",
    renter: studentData[4],
    vehicle: vehicleData[4],
    owner: ownerData[4],
    booking_start: "2025-06-15T09:00:00",
    booking_days: 2,
    booking_status: "Pending",
    isPaid: false,
    totalPrice: 2 * 1800,
  },
  {
    booking_id: "booking_4",
    renter: studentData[5],
    vehicle: vehicleData[6],
    owner: ownerData[1],
    booking_start: "2025-06-18T14:00:00",
    booking_days: 4,
    booking_status: "Confirmed",
    isPaid: true,
    totalPrice: 4 * 3800,
  },
  {
    booking_id: "booking_5",
    renter: studentData[3],
    vehicle: vehicleData[3],
    owner: ownerData[3],
    booking_start: "2025-06-20T12:00:00",
    booking_days: 1,
    booking_status: "Cancelled",
    isPaid: false,
    totalPrice: 1 * 4000,
  },
  {
    booking_id: "booking_6",
    renter: studentData[1],
    vehicle: vehicleData[5],
    owner: ownerData[0],
    booking_start: "2025-06-22T11:00:00",
    booking_days: 6,
    booking_status: "Confirmed",
    isPaid: true,
    totalPrice: 6 * 3200,
  },
  {
  booking_id: "booking_7",
  renter: lecturerData[1],
  vehicle: vehicleData[7],
  owner: ownerData[2],
  booking_start: "2025-06-25T09:00:00",
  booking_days: 3,
  booking_status: "Confirmed",
  isPaid: true,
  totalPrice: 3 * 7500,
},
{
  booking_id: "booking_8",
  renter: lecturerData[0],
  vehicle: vehicleData[8],
  owner: ownerData[3],
  booking_start: "2025-06-28T08:00:00",
  booking_days: 2,
  booking_status: "Pending",
  isPaid: false,
  totalPrice: 2 * 9000,
}


];


// Dashboard calculation:
export const dashboardTransportData = {
    totalBookings: vehicleBookingsData.length,
    totalRevenue: vehicleBookingsData
        .filter(booking => booking.isPaid)
        .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0),
    bookings: vehicleBookingsData,
};