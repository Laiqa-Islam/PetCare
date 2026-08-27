"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PetFileDelete({petId,kind,itemId,publicId}:{petId:string;kind:"gallery"|"record";itemId:string;publicId:string}){const[busy,setBusy]=useState(false);const router=useRouter();async function remove(){if(!window.confirm("Remove this file from the pet record?"))return;setBusy(true);const response=await fetch(`/api/pets/${petId}/uploads`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind,itemId,publicId})});setBusy(false);if(response.ok)router.refresh();}return <button type="button" className="danger-link" disabled={busy} onClick={remove}>{busy?"Removing…":"Remove"}</button>}
