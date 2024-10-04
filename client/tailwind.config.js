const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    extend: {},
    
  },
  
  plugins: [
    flowbite.plugin(),
    
  ],
}

