import Dagger from "../Dagger/Dagger";

interface LocationCardProps {
    name: string;
    code: string;
    subject: string;
    locationDescription: string;
    strategicAssessment: string;
    defensiveCapabilities: string[];
    status: string;
}

const LocationCard = ({
    name,
    code,
    subject,
    locationDescription,
    strategicAssessment,
    defensiveCapabilities,
    status
}: LocationCardProps) => {
    return (
        <div className="w-80 flex flex-col justify-center items-center absolute top-4 right-5 transform -translate-x-1/2 z-10 pointer-events-none">
            {/* HEADER: Centered with decorative lines */}
            <div className="flex justify-center items-center gap-4 border-b-2 border-stone-800/20 pb-6 mb-6">
                <span className="border-t-2 border-stone-800 h-1 w-12 opacity-60 bg-stone-950"></span>
                <h1 className="text-3xl font-bold text-center uppercase tracking-widest text-stone-950">
                    {name}
                </h1>
                <span className="border-t-2 border-stone-800 h-1 w-12 opacity-60 bg-stone-950"></span>
                <Dagger />
            </div>

            {/* SUB-HEADER INFO */}
            <div className="mb-6 space-y-1">
                <p>
                    {code} SUBJECT:
                </p>
                <p>
                    {subject} LOCATION: {locationDescription}
                </p>
            </div>

            {/* MAIN DESCRIPTION */}
            <div className="mb-6">
                <p className="font-bold text-stone-800 uppercase tracking-wide text-xs mb-1">
                    Strategic Assessment:
                </p>
                <p className="opacity-90 text-justify">
                    {strategicAssessment}
                </p>
            </div>

            {/* DEFENSE / LIST SECTION */}
            <div className="mb-8">
                <p className="font-bold text-stone-800 uppercase tracking-wide text-xs mb-1">
                    Defensive Capabilities:
                </p>
                <ul className="list-disc pl-5 space-y-2 opacity-90 marker:text-stone-500">
                    {defensiveCapabilities.map((capability, index) => (
                        <li key={index}>{capability}</li>
                    ))}
                </ul>
            </div>

            {/* STATUS FOOTER */}
            <div className="flex justify-between items-center pt-4 border-t border-stone-800/10">
                <div>
                    <p className="font-bold text-stone-800 uppercase tracking-wide text-xs">
                        STATUS: {status}
                    </p>
                </div>

                {/* Simple Icon Placeholder */}
                <div className="opacity-80">
                    {/* Replace with your specific SVG */}
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default LocationCard;
