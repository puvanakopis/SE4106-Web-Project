import starIconFilled from './Accommodation/starIconFilled.svg'
import starIconOutlined from './Accommodation/starIconOutlined.svg'
import locationFilledIcon from './Accommodation/locationFilledIcon.svg'
import locationIcon from './Accommodation/locationIcon.svg'
import emailIcon from './Accommodation/emailIcon.svg'
import phoneIcon from './Accommodation/phoneIcon.svg'
import roomImg1 from './Accommodation/roomImg1.png'
import roomImg2 from './Accommodation/roomImg2.png'
import roomImg3 from './Accommodation/roomImg3.png'
import roomImg4 from './Accommodation/roomImg4.png'
import freeWifiIcon from './Accommodation/freeWifiIcon.svg'
import freeBreakfastIcon from './Accommodation/freeBreakfastIcon.svg'
import roomServiceIcon from './Accommodation/roomServiceIcon.svg'
import mountainIcon from './Accommodation/mountainIcon.svg'
import poolIcon from './Accommodation/poolIcon.svg'
import AccommodationHero from './Accommodation/AccommodationHero.png'
import badgeIcon from './Accommodation/badgeIcon.svg'
import guestsIcon from './Accommodation/guestsIcon.svg'
import heartIcon from './Accommodation/heartIcon.svg'
import homeIcon from './Accommodation/homeIcon.svg'
import hostIcon from './Accommodation/hostIcon.png'
import logo from './logo.png'
import menuIcon from './menuIcon.svg'
import closeMenu from './closeMenu.svg'
import closeIcon from './closeIcon.svg'
import wardrobeIcon from './Accommodation/Wardrobe.png'
import studyTableIcon from './Accommodation/studyTable.png'
import sharedKitchenIcon from './Accommodation/sharedKitchen.png'
import privateEntranceIcon from './Accommodation/privateEntrance.png'
import fanIcon from './Accommodation/fan.png'
import attachedBathroomIcon from './Accommodation/attachedBathroom.png'
import miniFridgeIcon from './Accommodation/miniFridge.png'
import laundryIcon from './Accommodation/laundry.png'
import privateBathroomIcon from './Accommodation/privateBathroom.png'
import studyLampIcon from './Accommodation/studyLamp.png'


export const assets = {
    locationIcon,
    emailIcon,
    phoneIcon,
    starIconFilled,
    starIconOutlined,
    locationFilledIcon,
    roomImg1,
    roomImg2,
    roomImg3,
    roomImg4,
    freeWifiIcon,
    freeBreakfastIcon,
    roomServiceIcon,
    mountainIcon,
    poolIcon,
    AccommodationHero,
    badgeIcon,
    guestsIcon,
    heartIcon,
    homeIcon,
    hostIcon,
    logo,
    menuIcon,
    closeMenu,
    closeIcon,
    wardrobeIcon,
    studyTableIcon,
    sharedKitchenIcon,
    privateEntranceIcon,
    fanIcon,
    attachedBathroomIcon,
    privateBathroomIcon,
    miniFridgeIcon,
    laundryIcon,
    studyLampIcon
}

export const cities = [
    "Belihuloya",
];

// For Room Details Page
export const roomCommonData = [
    { icon: assets.homeIcon, title: "Clean & Safe Stay", description: "A well-maintained and hygienic space just for you." },
    { icon: assets.badgeIcon, title: "Enhanced Cleaning", description: "This host follows Staybnb's strict cleaning standards." },
    { icon: assets.locationFilledIcon, title: "Excellent Location", description: "90% of guests rated the location 5 stars." },
    { icon: assets.heartIcon, title: "Smooth Check-In", description: "100% of guests gave check-in a 5-star rating." },
];

// Facility Icon
export const facilityIcons = {
    "Wi-Fi": assets.freeWifiIcon,
    "Free Breakfast": assets.freeBreakfastIcon,
    "Room Service": assets.roomServiceIcon,
    "Mountain View": assets.mountainIcon,
    "Pool Access": assets.poolIcon,
    "Wardrobe": assets.wardrobeIcon,
    "Study Table": assets.studyTableIcon,
    "Shared Kitchen": assets.sharedKitchenIcon,
    "Private Entrance": assets.privateEntranceIcon,
    "Fan": assets.fanIcon,
    "Attached Bathroom": assets.attachedBathroomIcon,
    "Private Bathroom": assets.privateBathroomIcon,
    "Mini Fridge": assets.miniFridgeIcon,
    "Laundry": assets.laundryIcon,
    "Study Lamp": assets.studyLampIcon
};












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








// User Data
export const userDummyData = [
  {
    _id: "user_1",
    username: "Mr. Senaka Perera",
    email: "senaka@gmail.com",
    role: "hotelOwner",
    recentSearchedCities: ["Pambahinna"]
  },
  {
    _id: "user_2",
    username: "Mrs. Kusum Fernando",
    email: "kusum@gmail.com",
    role: "hotelOwner",
    recentSearchedCities: ["Belihuloya"]
  },
  {
    _id: "user_3",
    username: "Mr. Nuwan Silva",
    email: "nuwan.silva@hostmail.com",
    role: "student",
    recentSearchedCities: ["Pambahinna", "Balangoda"]
  },
  {
    _id: "user_4",
    username: "Ms. Ishara Jayasinghe",
    email: "ishara.jaya@studentmail.com",
    role: "student",
    recentSearchedCities: ["Belihuloya", "Uggalduwa"]
  },
  {
    _id: "user_5",
    username: "Mr. Dilan Kumara",
    email: "dilan.k@accom.lk",
    role: "hotelOwner",
    recentSearchedCities: ["Pambahinna"]
  },
  {
    _id: "user_6",
    username: "Ms. Thilini Weerasinghe",
    email: "thilini.w@unilife.edu",
    role: "student",
    recentSearchedCities: ["Belihuloya", "Pambahinna"]
  },
  {
    _id: "user_7",
    username: "Mr. Chathura De Silva",
    email: "chathura@room.lk",
    role: "hotelOwner",
    recentSearchedCities: ["Balangoda"]
  },
  {
    _id: "user_8",
    username: "Ms. Nadeesha Rajapaksha",
    email: "nadeesha@live.com",
    role: "student",
    recentSearchedCities: ["Uggalduwa", "Belihuloya"]
  },
  {
    _id: "user_9",
    username: "Mr. Hiran Wickramasinghe",
    email: "hiran.wick@host.lk",
    role: "hotelOwner",
    recentSearchedCities: ["Pambahinna", "Wewelwatta"]
  },
  {
    _id: "user_10",
    username: "Ms. Dinithi Perera",
    email: "dinithi.perera@studentmail.com",
    role: "student",
    recentSearchedCities: ["Belihuloya", "Pambahinna"]
  },
  {
    _id: "user_11",
    username: "Mr. Ruwan Jayawardena",
    email: "ruwan.jayawardena@hostmail.com",
    role: "hotelOwner",
    recentSearchedCities: ["Balangoda", "Pambahinna"]
  },
  {
    _id: "user_12",
    username: "Ms. Harini Fernando",
    email: "harini.fernando@studentmail.com",
    role: "student",
    recentSearchedCities: ["Belihuloya"]
  },
  {
    _id: "user_13",
    username: "Mr. Kasun Madushanka",
    email: "kasun.m@accom.lk",
    role: "hotelOwner",
    recentSearchedCities: ["Uggalduwa"]
  },
  {
    _id: "user_14",
    username: "Ms. Nisansala Perera",
    email: "nisansala.p@studentmail.com",
    role: "student",
    recentSearchedCities: ["Pambahinna", "Wewelwatta"]
  },
  {
    _id: "user_15",
    username: "Mr. Sandun Rathnayake",
    email: "sandun.rath@host.lk",
    role: "hotelOwner",
    recentSearchedCities: ["Belihuloya"]
  },
  {
    _id: "user_16",
    username: "Ms. Dilani Jayawardena",
    email: "dilani.j@studentmail.com",
    role: "student",
    recentSearchedCities: ["Balangoda", "Pambahinna"]
  },
  {
    _id: "user_17",
    username: "Mr. Anura Silva",
    email: "anura.silva@room.lk",
    role: "hotelOwner",
    recentSearchedCities: ["Wewelwatta", "Uggalduwa"]
  },
  {
    _id: "user_18",
    username: "Ms. Tharushi Senanayake",
    email: "tharushi.s@studentmail.com",
    role: "student",
    recentSearchedCities: ["Pambahinna"]
  },
  {
    _id: "user_19",
    username: "Mr. Chinthaka Kumara",
    email: "chinthaka.k@hostmail.com",
    role: "hotelOwner",
    recentSearchedCities: ["Belihuloya", "Balangoda"]
  },
  {
    _id: "user_20",
    username: "Ms. Rashmi Perera",
    email: "rashmi.p@studentmail.com",
    role: "student",
    recentSearchedCities: ["Uggalduwa", "Pambahinna"]
  },
  {
    _id: "user_21",
    username: "Mr. Pradeep Gunasekara",
    email: "pradeep.g@hostmail.com",
    role: "hotelOwner",
    recentSearchedCities: ["Pambahinna", "Wewelwatta"]
  },
  {
    _id: "user_22",
    username: "Ms. Sanduni Hettiarachchi",
    email: "sanduni.h@studentmail.com",
    role: "student",
    recentSearchedCities: ["Belihuloya", "Balangoda"]
  },
  {
    _id: "user_23",
    username: "Mr. Lasantha Rajapaksha",
    email: "lasantha.r@accom.lk",
    role: "hotelOwner",
    recentSearchedCities: ["Uggalduwa"]
  },
  {
    _id: "user_24",
    username: "Ms. Harshani Silva",
    email: "harshani.s@studentmail.com",
    role: "student",
    recentSearchedCities: ["Pambahinna", "Belihuloya"]
  },
  {
    _id: "user_25",
    username: "Mr. Chamal De Silva",
    email: "chamal.ds@host.lk",
    role: "hotelOwner",
    recentSearchedCities: ["Balangoda"]
  },
  {
    _id: "user_26",
    username: "Ms. Nirosha Wickramasinghe",
    email: "nirosha.w@studentmail.com",
    role: "student",
    recentSearchedCities: ["Wewelwatta", "Pambahinna"]
  },
  {
    _id: "user_27",
    username: "Mr. Saman Jayasuriya",
    email: "saman.j@room.lk",
    role: "hotelOwner",
    recentSearchedCities: ["Uggalduwa", "Belihuloya"]
  },
  {
    _id: "user_28",
    username: "Ms. Malithi Fernando",
    email: "malithi.f@studentmail.com",
    role: "student",
    recentSearchedCities: ["Balangoda"]
  },
  {
    _id: "user_29",
    username: "Mr. Tharindu Perera",
    email: "tharindu.p@hostmail.com",
    role: "hotelOwner",
    recentSearchedCities: ["Pambahinna"]
  },
  {
    _id: "user_30",
    username: "Ms. Chamari Jayawardena",
    email: "chamari.j@studentmail.com",
    role: "student",
    recentSearchedCities: ["Belihuloya", "Wewelwatta"]
  }
];

// Hotel Data
export const hotelDummyData = [
  {
    _id: "hotel_1",
    name: "Landa Villa",
    address: "Near Sabaragamuwa University Main Entrance, Pambahinna",
    city: "Pambahinna",
    contact: "+94781234567",
    amenities: ["Wi-Fi", "Study Table", "Laundry Service", "Meal Plan"],
    owner: userDummyData[0] // Mr. Senaka Perera
  },
  {
    _id: "hotel_2",
    name: "GreenHill Boarding",
    address: "Uggalduwa Road, 200m from Uni North Gate, Pambahinna",
    city: "Pambahinna",
    contact: "+94782345678",
    amenities: ["Proximity to Campus", "Shared Kitchen", "Wi-Fi", "24/7 Water"],
    owner: userDummyData[1] // Mrs. Kusum Fernando
  },
  {
    _id: "hotel_3",
    name: "Lakeview Residence",
    address: "Opposite University Hostel Complex, Belihuloya",
    city: "Belihuloya",
    contact: "+94783456789",
    amenities: ["Lake View", "Transport Facility", "Study Desk", "Free Wi-Fi"],
    owner: userDummyData[4] // Mr. Dilan Kumara
  },
  {
    _id: "hotel_4",
    name: "Mountain Breeze Inn",
    address: "Hilltop Lane, behind Engineering Faculty, Pambahinna",
    city: "Pambahinna",
    contact: "+94784567890",
    amenities: ["Canteen Access", "Quiet Environment", "Wi-Fi", "Hot Water"],
    owner: userDummyData[6] // Mr. Chathura De Silva
  },
  {
    _id: "hotel_5",
    name: "Riverside Stay",
    address: "Near Belihuloya Bridge, Belihuloya",
    city: "Belihuloya",
    contact: "+94785678901",
    amenities: ["River View", "Wi-Fi", "Laundry", "Balcony"],
    owner: userDummyData[8] // Mr. Hiran Wickramasinghe
  },
  {
    _id: "hotel_6",
    name: "Hillside Guest House",
    address: "Kumbalgamuwa Junction, Pambahinna",
    city: "Pambahinna",
    contact: "+94786789012",
    amenities: ["Wi-Fi", "Quiet Study Area", "Attached Bathroom", "Hot Water"],
    owner: userDummyData[10] // Mr. Ruwan Jayawardena
  },
  {
    _id: "hotel_7",
    name: "Forest Edge Lodge",
    address: "Behind Science Faculty, Pambahinna",
    city: "Pambahinna",
    contact: "+94787890123",
    amenities: ["Shared Kitchen", "Wi-Fi", "Peaceful Environment", "Study Table"],
    owner: userDummyData[12] // Mr. Kasun Madushanka
  },
  {
    _id: "hotel_8",
    name: "Campus Corner",
    address: "Next to Medical Center, Pambahinna",
    city: "Pambahinna",
    contact: "+94788901234",
    amenities: ["Attached Bathroom", "Wi-Fi", "Meal Plan", "Laundry"],
    owner: userDummyData[14] // Mr. Sandun Rathnayake
  },
  {
    _id: "hotel_9",
    name: "Vista Lodge",
    address: "Opposite Faculty of Applied Sciences, Belihuloya",
    city: "Belihuloya",
    contact: "+94789012345",
    amenities: ["Wi-Fi", "Balcony View", "Hot Water", "Private Room"],
    owner: userDummyData[16] // Mr. Anura Silva
  },
  {
    _id: "hotel_10",
    name: "Sunrise Residence",
    address: "1km from Main Gate, Near Lake Road, Belihuloya",
    city: "Belihuloya",
    contact: "+94780123456",
    amenities: ["Wi-Fi", "Study Table", "Shared Kitchen", "24/7 Water"],
    owner: userDummyData[18] // Mr. Chinthaka Kumara
  },
  {
    _id: "hotel_11",
    name: "Uni Villa",
    address: "Near Bus Stand, Pambahinna",
    city: "Pambahinna",
    contact: "+94781234568",
    amenities: ["Wi-Fi", "Meal Plan", "Laundry", "Fan"],
    owner: userDummyData[20] // Mr. Pradeep Gunasekara
  },
  {
    _id: "hotel_12",
    name: "Blue Sky Boarding",
    address: "Next to Student Center, Belihuloya",
    city: "Belihuloya",
    contact: "+94782345679",
    amenities: ["Balcony", "Wi-Fi", "Shared Kitchen", "Study Table"],
    owner: userDummyData[22] // Mr. Lasantha Rajapaksha
  },
  {
    _id: "hotel_13",
    name: "Green Nest",
    address: "Uggalduwa Road, Pambahinna",
    city: "Pambahinna",
    contact: "+94783456780",
    amenities: ["Attached Bathroom", "Hot Water", "Wi-Fi", "Laundry"],
    owner: userDummyData[24] // Mr. Chamal De Silva
  },
  {
    _id: "hotel_14",
    name: "Tranquil Stay",
    address: "Hillview Lane, Belihuloya",
    city: "Belihuloya",
    contact: "+94784567891",
    amenities: ["Peaceful Environment", "Shared Kitchen", "Wi-Fi", "Meal Plan"],
    owner: userDummyData[26] // Mr. Saman Jayasuriya
  },
  {
    _id: "hotel_15",
    name: "Student Home",
    address: "Opposite Playground, Pambahinna",
    city: "Pambahinna",
    contact: "+94785678902",
    amenities: ["Study Desk", "Shared Kitchen", "Laundry", "Wi-Fi"],
    owner: userDummyData[28] // Mr. Tharindu Perera
  }
];

// Rooms Data
export const roomsDummyData = [
  // Rooms for hotel_1 (Landa Villa)
  {
    _id: "room_1",
    hotel: hotelDummyData[0], // Landa Villa
    roomType: "Single Bed",
    pricePerMonth: 3500,
    amenities: ["Wi-Fi", "Study Table", "Shared Kitchen"],
    images: [roomImg1, roomImg2],
    isAvailable: true
  },
  {
    _id: "room_2",
    hotel: hotelDummyData[0], // Landa Villa
    roomType: "Double Bed",
    pricePerMonth: 6000,
    amenities: ["Wi-Fi", "Attached Bathroom", "Balcony"],
    images: [roomImg3, roomImg4],
    isAvailable: false
  },

  // Rooms for hotel_2 (GreenHill Boarding)
  {
    _id: "room_3",
    hotel: hotelDummyData[1], // GreenHill Boarding
    roomType: "Annexe",
    pricePerMonth: 8000,
    amenities: ["Private Entrance", "Wi-Fi", "Mini Fridge"],
    images: [roomImg1, roomImg2],
    isAvailable: true
  },
  {
    _id: "room_4",
    hotel: hotelDummyData[1], // GreenHill Boarding
    roomType: "Single Bed",
    pricePerMonth: 4500,
    amenities: ["Fan", "Wi-Fi", "Study Table"],
    images: [roomImg3, roomImg4],
    isAvailable: true
  },

  // Rooms for hotel_3 (Lakeview Residence)
  {
    _id: "room_5",
    hotel: hotelDummyData[2], // Lakeview Residence
    roomType: "Double Bed",
    pricePerMonth: 6500,
    amenities: ["Lake View", "Wi-Fi", "Hot Water"],
    images: [roomImg1, roomImg2],
    isAvailable: true
  },
  {
    _id: "room_6",
    hotel: hotelDummyData[2], // Lakeview Residence
    roomType: "Triple Sharing",
    pricePerMonth: 7000,
    amenities: ["Wi-Fi", "Study Table", "Shared Kitchen"],
    images: [roomImg3, roomImg4],
    isAvailable: false
  },

  // Rooms for hotel_4 (Mountain Breeze Inn)
  {
    _id: "room_7",
    hotel: hotelDummyData[3], // Mountain Breeze Inn
    roomType: "Single Bed",
    pricePerMonth: 3800,
    amenities: ["Wi-Fi", "Fan", "Laundry"],
    images: [roomImg1, roomImg2],
    isAvailable: true
  },
  {
    _id: "room_8",
    hotel: hotelDummyData[3], // Mountain Breeze Inn
    roomType: "Double Bed",
    pricePerMonth: 6200,
    amenities: ["Wi-Fi", "Canteen Access", "Hot Water"],
    images: [roomImg3, roomImg4],
    isAvailable: true
  },

  // Rooms for hotel_5 (Riverside Stay)
  {
    _id: "room_9",
    hotel: hotelDummyData[4], // Riverside Stay
    roomType: "Single Bed",
    pricePerMonth: 4000,
    amenities: ["River View", "Balcony", "Wi-Fi"],
    images: [roomImg1, roomImg2],
    isAvailable: false
  },
  {
    _id: "room_10",
    hotel: hotelDummyData[4], // Riverside Stay
    roomType: "Double Bed",
    pricePerMonth: 6900,
    amenities: ["Wi-Fi", "Study Table", "Attached Bathroom"],
    images: [roomImg3, roomImg4],
    isAvailable: true
  },

  // Rooms for hotel_6 (Hillside Guest House)
  {
    _id: "room_11",
    hotel: hotelDummyData[5], // Hillside Guest House
    roomType: "Single Bed",
    pricePerMonth: 3900,
    amenities: ["Hot Water", "Wi-Fi", "Quiet Study Area"],
    images: [roomImg1, roomImg2],
    isAvailable: true
  },
  {
    _id: "room_12",
    hotel: hotelDummyData[5], // Hillside Guest House
    roomType: "Double Bed",
    pricePerMonth: 6400,
    amenities: ["Attached Bathroom", "Wi-Fi", "Fan"],
    images: [roomImg3, roomImg4],
    isAvailable: false
  },

  // Rooms for hotel_7 (Forest Edge Lodge)
  {
    _id: "room_13",
    hotel: hotelDummyData[6], // Forest Edge Lodge
    roomType: "Triple Sharing",
    pricePerMonth: 6000,
    amenities: ["Shared Kitchen", "Study Table", "Wi-Fi"],
    images: [roomImg1, roomImg2],
    isAvailable: true
  },
  {
    _id: "room_14",
    hotel: hotelDummyData[6], // Forest Edge Lodge
    roomType: "Double Bed",
    pricePerMonth: 5800,
    amenities: ["Peaceful Environment", "Wi-Fi", "Fan"],
    images: [roomImg3, roomImg4],
    isAvailable: true
  },

  // Rooms for hotel_8 (Campus Corner)
  {
    _id: "room_15",
    hotel: hotelDummyData[7], // Campus Corner
    roomType: "Single Bed",
    pricePerMonth: 4200,
    amenities: ["Meal Plan", "Laundry", "Wi-Fi"],
    images: [roomImg1, roomImg2],
    isAvailable: true
  },
  {
    _id: "room_16",
    hotel: hotelDummyData[7], // Campus Corner
    roomType: "Annexe",
    pricePerMonth: 8500,
    amenities: ["Private Room", "Attached Bathroom", "Wi-Fi"],
    images: [roomImg3, roomImg4],
    isAvailable: true
  },

  // Rooms for hotel_9 (Vista Lodge)
  {
    _id: "room_17",
    hotel: hotelDummyData[8], // Vista Lodge
    roomType: "Double Bed",
    pricePerMonth: 6700,
    amenities: ["Balcony View", "Wi-Fi", "Hot Water"],
    images: [roomImg1, roomImg2],
    isAvailable: true
  },
  {
    _id: "room_18",
    hotel: hotelDummyData[8], // Vista Lodge
    roomType: "Single Bed",
    pricePerMonth: 4000,
    amenities: ["Wi-Fi", "Study Table"],
    images: [roomImg3, roomImg4],
    isAvailable: false
  },

  // Rooms for hotel_10 (Sunrise Residence)
  {
    _id: "room_19",
    hotel: hotelDummyData[9], // Sunrise Residence
    roomType: "Single Bed",
    pricePerMonth: 4200,
    amenities: ["Shared Kitchen", "Wi-Fi", "Study Table"],
    images: [roomImg1, roomImg2],
    isAvailable: true
  },
  {
    _id: "room_20",
    hotel: hotelDummyData[9], // Sunrise Residence
    roomType: "Double Bed",
    pricePerMonth: 6600,
    amenities: ["24/7 Water", "Attached Bathroom", "Wi-Fi"],
    images: [roomImg3, roomImg4],
    isAvailable: false
  }
];

// User Bookings Dummy Data
export const userBookingsDummyData = [
    {
        "_id": "booking_1",
        "user": userDummyData,
        "room": roomsDummyData[1],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-30T00:00:00.000Z",
        "checkOutDate": "2025-05-01T00:00:00.000Z",
        "totalPrice": 299,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Stripe",
        "isPaid": true
    },
    {
        "_id": "booking_2",
        "user": userDummyData,
        "room": roomsDummyData[0],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-27T00:00:00.000Z",
        "checkOutDate": "2025-04-28T00:00:00.000Z",
        "totalPrice": 399,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
    },
    {
        "_id": "booking_3",
        "user": userDummyData,
        "room": roomsDummyData[3],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-11T00:00:00.000Z",
        "checkOutDate": "2025-04-12T00:00:00.000Z",
        "totalPrice": 199,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false
    }
]


// Add rooms to hotels
hotelDummyData.forEach(hotel => {
  hotel.rooms = roomsDummyData.filter(room => room.hotel._id === hotel._id);
});

// Add hotels to owners
userDummyData.forEach(user => {
  if (user.role === "hotelOwner") {
    user.hotels = hotelDummyData.filter(hotel => hotel.owner._id === user._id);
  } else {
    user.hotels = []; // Students don't own hotels
  }
});

export default {
  userDummyData,
  hotelDummyData,
  roomsDummyData
};