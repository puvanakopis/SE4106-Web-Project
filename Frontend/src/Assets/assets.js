import starIconFilled from './Accommodation/starIconFilled.svg'
import starIconOutlined from './Accommodation/starIconOutlined.svg'
import locationFilledIcon from './Accommodation/locationFilledIcon.svg'
import locationIcon from './Accommodation/locationIcon.svg'
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
    username: "Mr. Dilshan Kumara",
    email: "dilshan@gmail.com",
    role: "hotelOwner",
    recentSearchedCities: ["Kumbalgamuwa"]
  },
  {
    _id: "user_4",
    username: "Mrs. Tharushi Nisansala",
    email: "tharushi@gmail.com",
    role: "hotelOwner",
    recentSearchedCities: ["Pambahinna"]
  },
  {
    _id: "user_5",
    username: "Mr. Ruwan Jayasinghe",
    email: "ruwan@gmail.com",
    role: "hotelOwner",
    recentSearchedCities: ["Belihuloya"]
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
];




// Rooms Data
export const roomsDummyData = [
  {
    _id: "room_1",
    hotel: hotelDummyData[0],
    roomType: "Single Bed",
    pricePerMonth: 3000,
    amenities: ["Wi-Fi", "Study Table", "Shared Kitchen"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_2",
    hotel: hotelDummyData[0],
    roomType: "Double Bed",
    pricePerMonth: 6000,
    amenities: ["Wi-Fi", "Attached Bathroom", "Wardrobe"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_3",
    hotel: hotelDummyData[0],
    roomType: "Triple Sharing",
    pricePerMonth: 6500,
    amenities: ["Study Table", "Shared Kitchen", "Laundry"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_4",
    hotel: hotelDummyData[1],
    roomType: "Annexe",
    pricePerMonth: 9000,
    amenities: ["Wi-Fi", "Private Entrance", "Mini Fridge"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_5",
    hotel: hotelDummyData[1],
    roomType: "Single Bed",
    pricePerMonth: 4500,
    amenities: ["Fan", "Study Table", "Wi-Fi"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_6",
    hotel: hotelDummyData[1],
    roomType: "Double Bed",
    pricePerMonth: 5500,
    amenities: ["Attached Bathroom", "Wi-Fi", "Wardrobe"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_7",
    hotel: hotelDummyData[1],
    roomType: "Triple Sharing",
    pricePerMonth: 9000,
    amenities: ["Wi-Fi", "Study Table", "Shared Kitchen"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_8",
    hotel: hotelDummyData[2],
    roomType: "Annexe",
    pricePerMonth: 10000,
    amenities: ["Private Bathroom", "Mini Fridge", "Wi-Fi"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_9",
    hotel: hotelDummyData[2],
    roomType: "Single Bed",
    pricePerMonth: 3000,
    amenities: ["Wi-Fi", "Study Table", "Fan"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_10",
    hotel: hotelDummyData[2],
    roomType: "Double Bed",
    pricePerMonth: 6000,
    amenities: ["Wi-Fi", "Wardrobe", "Attached Bathroom"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_11",
    hotel: hotelDummyData[2],
    roomType: "Triple Sharing",
    pricePerMonth: 10000,
    amenities: ["Shared Kitchen", "Wi-Fi", "Study Table"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_12",
    hotel: hotelDummyData[3],
    roomType: "Annexe",
    pricePerMonth: 12000,
    amenities: ["Private Entrance", "Mini Fridge", "Wi-Fi"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_13",
    hotel: hotelDummyData[3],
    roomType: "Single Bed",
    pricePerMonth: 2500,
    amenities: ["Wi-Fi", "Study Lamp", "Fan"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_14",
    hotel: hotelDummyData[3],
    roomType: "Double Bed",
    pricePerMonth: 5500,
    amenities: ["Wi-Fi", "Wardrobe", "Attached Bathroom"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_15",
    hotel: hotelDummyData[3],
    roomType: "Triple Sharing",
    pricePerMonth: 8500,
    amenities: ["Shared Kitchen", "Wi-Fi", "Laundry"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_16",
    hotel: hotelDummyData[4],
    roomType: "Annexe",
    pricePerMonth: 10000,
    amenities: ["Wi-Fi", "Mini Fridge", "Attached Bathroom"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_17",
    hotel: hotelDummyData[4],
    roomType: "Single Bed",
    pricePerMonth: 2500,
    amenities: ["Wi-Fi", "Study Table", "Fan"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_18",
    hotel: hotelDummyData[4],
    roomType: "Double Bed",
    pricePerMonth: 6500,
    amenities: ["Wi-Fi", "Wardrobe", "Attached Bathroom"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_19",
    hotel: hotelDummyData[4],
    roomType: "Triple Sharing",
    pricePerMonth: 8500,
    amenities: ["Wi-Fi", "Study Table", "Shared Kitchen"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_20",
    hotel: hotelDummyData[5],
    roomType: "Annexe",
    pricePerMonth: 9000,
    amenities: ["Wi-Fi", "Mini Fridge", "Private Entrance"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_21",
    hotel: hotelDummyData[5],
    roomType: "Single Bed",
    pricePerMonth: 3000,
    amenities: ["Fan", "Wi-Fi", "Study Lamp"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_22",
    hotel: hotelDummyData[5],
    roomType: "Double Bed",
    pricePerMonth: 5000,
    amenities: ["Wi-Fi", "Attached Bathroom", "Wardrobe"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_23",
    hotel: hotelDummyData[5],
    roomType: "Triple Sharing",
    pricePerMonth: 7500,
    amenities: ["Wi-Fi", "Shared Kitchen", "Laundry"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_24",
    hotel: hotelDummyData[6],
    roomType: "Annexe",
    pricePerMonth: 9500,
    amenities: ["Mini Fridge", "Wi-Fi", "Private Entrance"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_25",
    hotel: hotelDummyData[6],
    roomType: "Single Bed",
    pricePerMonth: 2500,
    amenities: ["Fan", "Wi-Fi", "Study Table"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_26",
    hotel: hotelDummyData[6],
    roomType: "Double Bed",
    pricePerMonth: 6500,
    amenities: ["Wi-Fi", "Wardrobe", "Attached Bathroom"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_27",
    hotel: hotelDummyData[6],
    roomType: "Triple Sharing",
    pricePerMonth: 7500,
    amenities: ["Study Table", "Shared Kitchen", "Wi-Fi"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_28",
    hotel: hotelDummyData[7],
    roomType: "Annexe",
    pricePerMonth: 9500,
    amenities: ["Private Bathroom", "Wi-Fi", "Mini Fridge"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_29",
    hotel: hotelDummyData[7],
    roomType: "Single Bed",
    pricePerMonth: 2500,
    amenities: ["Wi-Fi", "Study Table", "Fan"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  },
  {
    _id: "room_30",
    hotel: hotelDummyData[7],
    roomType: "Double Bed",
    pricePerMonth: 6500,
    amenities: ["Wi-Fi", "Attached Bathroom", "Wardrobe"],
    images: [roomImg1, roomImg2, roomImg3, roomImg4],
    isAvailable: true
  }
];
