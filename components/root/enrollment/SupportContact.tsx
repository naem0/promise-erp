import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

const SupportContact = () => {
    return (
        <Card className="py-0 max-w-md mx-auto">
            <CardContent className="p-4">
                <div className=" flex items-center gap-4 justify-center">
                    <Image
                        src={"/images/support-icon.png"}
                        alt="Support Representative"
                        width={136}
                        height={136}
                        className="rounded-full object-cover border-2 shadow-card"
                    />
                    <div className="flex flex-col gap-2">
                        <Link
                            href="tel:01550666800"
                            className=" border text-center border-secondary rounded-lg px-4 py-2 font-medium inline-block"
                        >
                            01550-666900
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            For any enrollment assistance, please call this number.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SupportContact