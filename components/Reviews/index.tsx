import React, { useEffect, useState } from "react";
import { Connector, useAccount, useConnect } from "wagmi";
import { CompanyInfo } from "../../models/companyInfo";
import { getDataIpfs } from "../common/utils/Ipfs";
import { getArrComment, getArrCompany } from "../common/utils/SmartContract";
import CommentCard from "../Home/CommentCard";
import CompanyCard from "../Home/CompanyCard";
import Filter from "../Home/Filter";
import { GridItemEight, GridItemFour, GridLayout } from "../Layout/GridLayout";
import AddCompany from "./AddCompany";
interface ReviewsProps {}

const Reviews: React.FunctionComponent<ReviewsProps> = (props) => {
  //wagmi
  const { connectors, connectAsync } = useConnect();

  const onConnect = async (connector: Connector) => {
    try {
      await connectAsync({ connector });
    } catch (error) {}
  };

  useEffect(() => {
    onConnect(connectors[0]);
  }, []);

  const [listCompanyData, setListCompanyData] = useState([]);
  const [arrCountCmt, setArrCountCmt] = useState([]);
  const [arrHash, setArrHash] = useState([]);
  const [isReloadData, setIsReloadData] = useState(false);

  const [filterComs, setFilterComs] = useState<CompanyInfo[] | null>(null);
  const { address } = useAccount();
  const [accountWallet, setAccountWallet] = useState<any>({});

  const getDataAndCount = async () => {
    let resData = await getArrCompany();
    let arr = resData?.map((e: any) => e.companyHash);
    if (filterComs) arr = filterComs;
    let arrCount: any = [];
    for (let val of arr) {
      let arrCommentData = await getArrComment(val);
      arrCount.push(arrCommentData.length || 0);
    }
    setArrCountCmt(arrCount.slice(0).reverse());
    setArrHash(arr.slice(0).reverse());
    const resDtCompany = await getDataIpfs(arr);
    setListCompanyData(resDtCompany.slice(0).reverse());
  };

  useEffect(() => {
    accountWallet.address && getDataAndCount();
  }, [filterComs]);

  useEffect(() => {
    if (isReloadData) {
      setFilterComs(null);
      getDataAndCount();
    }
    setIsReloadData(false);
  }, [isReloadData]);

  useEffect(() => {
    setAccountWallet({ address: address });
  }, [address]);

  return (
    <>
      <Filter setFilterComs={setFilterComs} />
      <GridLayout className="mt-[35px]">
        <GridItemEight>
          <AddCompany setIsReloadData={setIsReloadData} />
          {listCompanyData.map((e: any, i: number) => {
            if (e.type !== "Troll")
              return (
                <CompanyCard
                  countCmt={arrCountCmt[i]}
                  hash={arrHash[i]}
                  info={e}
                  key={i}
                  className="gap-6"
                />
              );
          })}
        </GridItemEight>
        <GridItemFour>
          <p className="text-3xl">Latest comments</p>
          {accountWallet.address && <CommentCard />}
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default Reviews;
