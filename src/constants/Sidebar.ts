import { Home, Grid, Flame, Video } from "lucide-react"

export const sidebarItems = [
    {
        type: "link",
        label: "Home",
        href: "/",
        icon: Home,
    },
    {
        type: "submenu",
        label: "Categories",
        icon: Grid,
        children: [
            { label: "Cars", href: "/categories/cars" },
            { label: "Bikes", href: "/categories/bikes" },
            { label: "Tyres", href: "/categories/tyres" },
            { label: "Oil & Service", href: "/categories/oil" },
        ],
    },
    {
        type: "link",
        label: "Popular",
        href: "/popular",
        icon: Flame,
    },
    {
        type: "link",
        label: "Videos",
        href: "/videos",
        icon: Video,
    },
]

export const categories = [
    { name: "Asian Food", slug: "asian-food" },
    { name: "BBQ & Grill", slug: "bbq-grill" },
    { name: "Beef", slug: "beef" },
    { name: "British Food", slug: "british-food" },
    { name: "Burgers", slug: "burgers" },
    { name: "Business Services", slug: "business-services" },
    { name: "Cafe", slug: "cafe" },
    { name: "Chef Recommendation", slug: "chef-recommendation" },
    { name: "Chicken", slug: "chicken" },
    { name: "Chinese Food", slug: "chinese-food" },
    { name: "Cocktails, Punch & Alcoholic Drinks", slug: "cocktails-drinks" },
    { name: "Decoration", slug: "decoration" },
    { name: "Dessert", slug: "dessert" },
    { name: "Drinks", slug: "drinks" },
    { name: "Fashion", slug: "fashion" },
    { name: "Food Products", slug: "food-products" },
    { name: "For Home", slug: "for-home" },
    { name: "French Food", slug: "french-food" },
    { name: "Greek Food", slug: "greek-food" },
    { name: "Halal Food", slug: "halal-food" },
    { name: "Indian Food", slug: "indian-food" },
    { name: "Italian Food", slug: "italian-food" },
    { name: "Kebab", slug: "kebab" },
    { name: "Lamb", slug: "lamb" },
    { name: "Mexican Food", slug: "mexican-food" },
    { name: "Moroccan Food", slug: "moroccan-food" },
    { name: "Other", slug: "other" },
    { name: "Pasta", slug: "pasta" },
    { name: "Pastry", slug: "pastry" },
    { name: "Pizza", slug: "pizza" },
    { name: "Pork", slug: "pork" },
    { name: "Portuguese Food", slug: "portuguese-food" },
    { name: "Restaurant", slug: "restaurant" },
    { name: "Salad", slug: "salad" },
    { name: "Seafood", slug: "seafood" },
    { name: "Soup", slug: "soup" },
    { name: "Spanish Food", slug: "spanish-food" },
    { name: "Thai Food", slug: "thai-food" },
    { name: "Where to Eat?", slug: "where-to-eat" },
]

export const giftRanges = [
    { name: "$0 - $1", slug: "0-1" },
    { name: "$1 - $5", slug: "1-5" },
    { name: "$1 - $10", slug: "1-10" },
    { name: "$10 - $50", slug: "10-50" },
    { name: "$50 - $200", slug: "50-200" },
    { name: "$200 - $500", slug: "200-500" },
    { name: "$500 - $1000", slug: "500-1000" },
    { name: "$1000+", slug: "1000-plus" },
]

export const MenuPages = [
    { name: "Advertise", slug: "advertise" },
    { name: "Privacy Policy", slug: "privacy" },
    { name: "Terms of Service", slug: "terms" },
    { name: "To Investor", slug: "help" },
]
