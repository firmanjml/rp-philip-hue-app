export const splash_slider = [
  {
    key: '1',
    title: 'Control your light\nbulb with ease',
    text: 'with the Lighue app, you can control your added light bulb from couch, bed, toilet or anywhere else.',
    image: require('../assets/images/bulb_whiteedit.png')
  },
  {
    key: '2',
    title: 'Set your home\nfrom anywhere',
    text: 'with the Lighue app, you can control your home from anyone you want, you can enjoy your time without thinking about your home.',
    image: require('../assets/images/home_whiteedit.png')
  },
  {
    key: '3',
    title: 'Automated\nSchedules',
    text: 'with the Lighue app, you can create a schedule that helps you to control light bulb, even when you are tired from work or school.',
    image: require('../assets/images/smart_whiteedit.png')
  }
];

export const step_slider = [
  {
    key: '1',
    title: '\n\nPlease make sure that your devices is connected to the same local network as your router before proceeding',
  },
  {
    key: '2',
    title: '1.\nFind Router IP address',
    text: 'Click the link below to guide you in searching your Router IP address',
    url: 'https://www.technobezz.com/how-to-find-your-router-ip-address/',
    image: require('../assets/images/routerip.png')
  },
  {
    key: '3',
    title: '2.\nLogin to your Router Setup Page',
    text: 'Once your Router IP is found, type in your Router IP address in the address field of your web browser. You will be ask for username and password to access your router setup page.\n\nBy default : \nusername and password is \'admin\'',
    image: require('../assets/images/logintorouter.jpg')
  },
  {
    key: '4',
    title: '3.\nSearch for bridge IP address',
    text: 'Look for DHCP Client List. There will a client list and look for \'Philips Hue\'. IP address of the Bridge will be shown as follows\n\nIf nothing shows up, make sure that your bridge is connected to router by LAN cable',
    image: require('../assets/images/routerclient.png')
  }
]

export const room_class = ["Living Room", "Kitchen", "Dining", "Bedroom", "Kids Bedroom", "Bathroom", "Nursery", "Recreation", "Office", "Gym", "Hallway", "Toilet", "Front Door", "Garage", "Terrace", "Garden", "Driveway", "Carport", "Other"];

export const class_img = {
  "Living Room": require("../assets/icons/room-icons/living-room.png"),
  "Kitchen": require("../assets/icons/room-icons/kitchen.png"),
  "Dining": require("../assets/icons/room-icons/dining.png"),
  "Bedroom": require("../assets/icons/room-icons/bedroom.png"),
  "Kids Bedroom": require("../assets/icons/room-icons/kids.png"),
  "Bathroom": require("../assets/icons/room-icons/bathroom.png"),
  "Nursery": require("../assets/icons/room-icons/nursery.png"),
  "Recreation": require("../assets/icons/room-icons/recreation.png"),
  "Office": require("../assets/icons/room-icons/office.png"),
  "Gym": require("../assets/icons/room-icons/gym.png"),
  "Hallway": require("../assets/icons/room-icons/hallway.png"),
  "Toilet": require("../assets/icons/room-icons/bathroom.png"),
  "Front Door": require("../assets/icons/room-icons/hallway.png"),
  "Garage": require("../assets/icons/room-icons/garage.png"),
  "Terrace": require("../assets/icons/room-icons/balcony.png"),
  "Garden": require("../assets/icons/room-icons/flowers.png"),
  "Driveway": require("../assets/icons/room-icons/garage.png"),
  "Carport": require("../assets/icons/room-icons/garage.png"),
  "Other": require("../assets/icons/room-icons/unknown.png")
}