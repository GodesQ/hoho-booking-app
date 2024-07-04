"use client";
import React from "react";
import {Image, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const TourFeaturedImage = (props) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { tour } = props;
    return (
        <>
            <Image onClick={onOpen} style={{ width: "100%", cursor: "pointer" }} classnames={{ wrapper: "w-auto" }} src={tour?.featured_image} alt={tour?.name} />
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" placement="top">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <Image onClick={onOpen} style={{ width: "100%" }} classnames={{ wrapper: "w-auto" }} src={tour?.featured_image} alt={tour?.name} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default TourFeaturedImage;
