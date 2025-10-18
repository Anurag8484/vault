import { Badge } from "./ui/badge"

export default function Header(){
    return(
        <div className="border-b-0 border-neutral-300 p-8 flex">
            <span className="font-bold text-3xl ">Vault <Badge variant="outline">v1.3</Badge></span>
        </div>
    )
}