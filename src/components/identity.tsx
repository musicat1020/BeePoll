import PersonalDIDCard from "./card/personalDIDCard";
import Github from "./card/githubCard";
import { handleDidRegistration } from "../services/handleDidRegirtration";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useUser } from "@auth0/nextjs-auth0/client";
import VerifyVcButton from "./button/verifyVcButton";
import { getAccessToken, resolveDid } from "../services/did";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import { handleGetCredential } from "../services/handleGetCredential";
import { useTheme } from "next-themes";

export default function Identity(props: any) {
  const githubUser = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  const { address, isConnected } = useAccount();
  const [did, setDid] = useState("");
  const [didDocument, setDidDocument] = useState(null)

  useEffect(() => {
    async function getDid() {
      const did = await handleDidRegistration(address);
      console.log("did in identity", did)
      const didDocument = await resolveDid(did, await getAccessToken()).then((res) => res?.didDocument);
      setDid(did);
      setDidDocument(didDocument);
    }

    if (isConnected) {
      getDid();
    }
  }, [address, isConnected, did]);

  const handleButtonClick = () => {

    console.log("github user", JSON.stringify(githubUser, null, 2))
    console.log("diddocument", JSON.stringify(didDocument, null, 2))

    const hasService = didDocument && didDocument['service'][0] ? true : false;
    if (hasService) {
      toast("Credential Already Exists", { hideProgressBar: true, theme: theme === "dark" ? "dark" : "light", autoClose: 1000 });
    }
    else {
      router.push('/api/auth/login');
    }
  };

  useEffect(() => {
    console.log("github user", githubUser)
    console.log("address", address)
    console.log("did", did)
    const hasService = didDocument && didDocument['service'][0] ? true : false;
    if (address != undefined && did != "" && githubUser != undefined && !hasService) {
      console.log("github user ", githubUser.user?.name)
      handleGetCredential(did, address, githubUser);
    }

  }, [githubUser, address, did, didDocument]);



  return (
    <div className="dark:bg-slate-800">
      <div className="flex mt-10 w-1/2">
        <p className="font-mono text-black font-bold text-3xl ml-5  dark:text-white">
          IDENTITY
        </p>
        <div className="flex space-x-4 ml-auto">
          <VerifyVcButton />
          <div className="tooltip" data-tip={did === "" ? "Connect Wallet Before Getting Credential" : null}>
            <button
              className={`btn btn-outline px-2 h-1/3 btn-warning ${did ? '' : 'brightness-50'}`}
              disabled={!did}
              onClick={handleButtonClick}
            >
              Get Credential
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
      <div className="divider ml-5 mr-auto w-1/2 my-[0px]"></div>
      <div className="flex items-center mt-2">
        <div>
          <p className="font-mono text-black text-xl ml-5 mt-3 mb-7 dark:text-white">
            LINKED WALLET
          </p>
          <PersonalDIDCard handleCopyClick={props.handleCopyClick} did={did} />
        </div>
        <div className="ml-7">
          <div className="flex items-center">
            <span className="font-mono text-black text-xl ml-5 mt-3 mb-7 dark:text-white">
              CREDENTIALS
            </span>
          </div>
          <div className="flex items-center">
            <Github handleCopyClick={props.handleCopyClick} did={did} />
          </div>
        </div>
      </div>
    </div>
  );
}