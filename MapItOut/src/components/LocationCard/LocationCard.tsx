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
        <div className="bg-yellow-50 bg-cover bg-center bg-no-repeat w-96 h-screen px-6 flex flex-col justify-center items-center relative z-10 pointer-events-none [mask-image:url('../../../public/Paper.png')] [mask-size:cover] [mask-position:center] [mask-repeat:no-repeat]">
            {/* HEADER: Centered with decorative lines */}
            <div className="flex justify-center items-center gap-4 border-b-2 border-stone-800/20 px-6 pb-6 mb-6">
                <span className="border-t-2 border-stone-800 h-1 w-12 opacity-60 bg-stone-950"></span>
                <h1 className="text-3xl font-bold text-center uppercase tracking-widest text-stone-950">
                    {name}
                </h1>
                <span className="border-t-2 border-stone-800 h-1 w-12 opacity-60 bg-stone-950"></span>
            </div>

            {/* SUB-HEADER INFO */}
            <div className="mb-6 space-y-1 text-stone-800 text-lg w-full">
                <p>
                    {code} SUBJECT:
                </p>
                <p>
                    {subject} LOCATION: <br></br>{locationDescription}
                </p>
            </div>

            {/* MAIN DESCRIPTION */}
            <div className="mb-6">
                <p className="font-bold text-stone-800 uppercase tracking-wide mb-1">
                    Strategic Assessment:
                </p>
                <p className="opacity-90 text-justify text-lg text-stone-800">
                    {strategicAssessment}
                </p>
            </div>

            {/* DEFENSE / LIST SECTION */}
            <div className="mb-8">
                <p className="font-bold text-stone-800 uppercase tracking-wide mb-1">
                    Defensive Capabilities:
                </p>
                <ul className="list-disc pl-5 space-y-2 opacity-90 marker:text-stone-500 text-stone-800 text-lg">
                    {defensiveCapabilities.map((capability, index) => (
                        <li key={index}>{capability}</li>
                    ))}
                </ul>
            </div>

            {/* STATUS FOOTER */}
            <div className="flex justify-between items-center pt-4 border-t border-stone-800/10">
                <div>
                    <p className="font-bold text-stone-800 uppercase tracking-wide text-xl">
                        STATUS: {status}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LocationCard;
