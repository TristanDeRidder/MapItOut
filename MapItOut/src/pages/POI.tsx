import { Canvas } from "@react-three/fiber";
import Locations from "../canvasses/Locations";
import LocationCard from "../components/LocationCard/LocationCard";
import locationsData from "../data/locations.json";
import { useParams } from "react-router-dom";

const cameraSettings = {
    fov: 60,
    near: 0.1,
    far: 200,
    position: [0, 6, 12] as [number, number, number],
};

const POI = () => {
    const { modelId } = useParams<{ modelId: string }>();

    // Find the location that matches the modelId from the URL params
    const locationData = Object.values(locationsData.locations).find(
        loc => loc.id === modelId
    );

    if (!locationData) {
        return (
                <div className="h-screen w-screen flex justify-center items-center">
                    <div className="text-center">
                        <h1 className="">Model Not Found</h1>
                        <a href="/" className="">
                            ← Back to Map
                        </a>
                    </div>
                </div>
        );
    }

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
                    <Locations modelId={locationData.name} />
                </Canvas>
            </div>
        </>
    );
}

export default POI;