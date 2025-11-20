
import { ShieldCheckIcon } from '../../components/icons/ShieldCheckIcon';
import { ZapIcon } from '../../components/icons/ZapIcon';
import { GlobeIcon } from '../../components/icons/GlobeIcon';
import { UsersIcon } from '../../components/icons/UsersIcon';

export const ABOUT_CONTENT = {
    metadata: {
        version: "1.1.0",
        lastUpdated: "October 2025"
    },
    hero: {
        title: "Redefining Spaces, Decentralizing Design.",
        subtitle: "Architex is the first AI-powered architectural ecosystem built on the Pi Network."
    },
    mission: {
        title: "Our Mission",
        body: "To democratize interior design by removing the barriers of cost and technical skill. We believe that everyone deserves a beautiful space, and every creator deserves fair ownership of their work."
    },
    pillars: [
        {
            title: "AI-Driven",
            desc: "Generative algorithms that turn thoughts into 3D models instantly.",
            icon: ZapIcon,
            color: "text-ai-violet"
        },
        {
            title: "Trustless",
            desc: "Powered by Pi Blockchain smart contracts for secure, escrowed payments.",
            icon: ShieldCheckIcon,
            color: "text-pi-gold"
        },
        {
            title: "Global",
            desc: "A borderless marketplace connecting designers and suppliers worldwide.",
            icon: GlobeIcon,
            color: "text-eco-green"
        }
    ],
    stats: [
        { label: "Active Designers", value: "12k+" },
        { label: "Designs Generated", value: "85k+" },
        { label: "Countries", value: "140+" }
    ],
    team: "Built by a distributed team of architects, engineers, and dreamers."
};
