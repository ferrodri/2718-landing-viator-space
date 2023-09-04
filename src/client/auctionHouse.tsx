'use client';

import { ethers } from 'ethers';
import type { PropsWithChildren } from 'react';
import { createContext, useMemo } from 'react';
import { C2718AuctionHouse__factory } from '../generated/contract-types';
// This was before a constant
const C2718_AUCTION_HOUSE_CONTRACT_ADDRESS = '';

interface AuctionHouseInterface {
    contractAddress: string;
}

export const AuctionHouseContext = createContext<AuctionHouseInterface>(undefined!);

const contract = C2718AuctionHouse__factory.connect(C2718_AUCTION_HOUSE_CONTRACT_ADDRESS, ethers.getDefaultProvider());

const AuctionHouseProvider = (props: PropsWithChildren) => {
    const value = useMemo(
        () => ({
            contractAddress: C2718_AUCTION_HOUSE_CONTRACT_ADDRESS
        }),
        []
    );

    return <AuctionHouseContext.Provider value={value}>{props.children}</AuctionHouseContext.Provider>;
};

export const useAuctionHouse = () => {
    //   const auctionHouse = useContext(AuctionHouseContext);

    const currentAuction = async () => {
        const currentAuction = await contract.auction();
        return currentAuction;
    };

    const placeBid = async (amount: string) => {
        const { planetId } = await contract.auction();
        const options = { value: ethers.utils.parseEther(`${amount}`) };
        await contract.createBid(planetId, options);
    };

    // const settleAuction = () => ({});

    return {
        placeBid,
        currentAuction
    };
};

export default AuctionHouseProvider;