import { onGet } from "../../services/webAuthnUtils";

export default function VerifyVcButton() {

  const handleButtonClick = async () => {
    const webAuthnId = await onGet()
    console.log("webAuthnId", webAuthnId)
    if (document && webAuthnId) {
      (
        document.getElementById("my_modal_2") as HTMLFormElement
      ).showModal();
    }
  }

  return (
    <div>
      <button className="btn btn-outline px-2 btn-info" onClick={() => {
        handleButtonClick()
      }}>Verify VC</button>
      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box p-8">
          <h3 className="font-bold text-lg text-white">
            Please input your VC data
          </h3>
          <div className="mt-2">
            <input
              type="text"
              placeholder="VC ID"
              className="input input-bordered w-full my-4"
            />
            <input
              type="text"
              placeholder="name"
              className="input input-bordered w-full my-4"
            />
            <input
              type="text"
              placeholder="nickname"
              className="input input-bordered w-full my-4"
            />
            <input
              type="text"
              placeholder="picture"
              className="input input-bordered w-full my-4"
            />
            <input
              type="text"
              placeholder="sub"
              className="input input-bordered w-full my-4"
            />
          </div>
          <button className="btn btn-outline btn-success my-2 btn-info px-2">Verify</button>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}