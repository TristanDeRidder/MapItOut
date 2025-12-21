import { Canvas } from "@react-three/fiber";
import Locations from "../canvasses/Locations";
import LocationCard from "../components/LocationCard/LocationCard";
import locationsData from "../data/locations.json";

const cameraSettings = {
    fov: 60,
    near: 0.1,
    far: 200,
    position: [0, 6, 12] as [number, number, number],
};

const POI = () => {
    // Get the first location from the data (you can later make this dynamic based on route params)
    const locationData = locationsData.locations[0];

    return (
        <>
            <LocationCard
                name={locationData.name}
                code={locationData.code}
                subject={locationData.subject}
                locationDescription={locationData.locationDescription}
                strategicAssessment={locationData.strategicAssessment}
                defensiveCapabilities={locationData.defensiveCapabilities}
                status={locationData.status}
            />

            <div id="canvas-wrap" className="w-screen h-screen">
                <Canvas shadows camera={cameraSettings}>
                    <Locations />
                </Canvas>
            </div>
        </>
    );
}

export default POI;