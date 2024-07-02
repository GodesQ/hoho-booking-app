import { Button, Image } from "@nextui-org/react";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import React from "react";

const CartTable = (props) => {

    return (
        <div className="travel-cart-body">
            <div className="travel-cart-table">
                <div className="travel-cart-table-header">
                    <div className="w-[45%] font-semibold">Tour Details</div>
                    <div className="w-[20%] font-semibold">Trip Date</div>
                    <div className="w-[15%] font-semibold">No. of Pax</div>
                    <div className="w-[15%] font-semibold">Total</div>
                    <div className="w-[5%]"></div>
                </div>
                {props.items.length > 0 ? (
                    <div className="travel-cart-table-body">
                        {props.items.map((item, index) => (
                            <div key={index} className="flex justify-start items-start gap-4 w-full">
                                <div className="w-[45%]">
                                    <div className="flex justify-start items-start gap-3">
                                        <Image
                                            alt={item.tour.name}
                                            className="object-cover object-top rounded-xl shadow"
                                            src={item.tour.featured_image}
                                            width={"37%"}
                                            classNames={{
                                                wrapper: "w-[37%]",
                                                img: "max-h-[120px] md:max-h-[120px] md:h-[120px] w-full",
                                            }}
                                        />
                                        <div className="w-[63%]">
                                            <h2 className="text-small sm:text-small font-medium mb-1.5">{item.tour.name}</h2>
                                            <span className="bg-primary-50 font-semibold text-primary text-[12px] text-center my-2 p-1 px-3 rounded-2xl cursor-context-menu">{item.tour.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[20%]"> {format(new Date(item.reservation_date), "MMM dd, yyyy")}</div>
                                <div className="w-[15%]">{item.number_of_pax} Pax</div>
                                <div className="w-[15%]">{item.total_amount?.toFixed(2)}</div>
                                <div className="w-[5%]">
                                    {
                                        props.handleRemoveCart && (
                                            <Button className="min-w-[100%] bg-primary text-white px-2" onClick={() => props.handleRemoveCart()}>
                                                <Trash size={20} />
                                            </Button>
                                        )
                                    }
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No Cart Item Found</div>
                )}
            </div>
        </div>
    );
};

export default CartTable;
