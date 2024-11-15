import MainFooter from "@components/main/MainFooter"
import MainContent from "@components/main/MainContent"
import MainHeader from "@components/main/MainHeader"
import { useState } from "react";

interface MainScreenProps { }

function MainScreen({ }: MainScreenProps) {
    const [searchQuery, setSearchQuery] = useState<string>('');
    return (
        <div className="relative z-10 h-full">
            <div className="h-full flex flex-col">
                <MainHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <MainContent searchQuery={searchQuery} />
                <MainFooter />
            </div>
        </div>
    )
}

export default MainScreen