import { z } from "zod";

export const checkoutSchema=z.object({
  name:z.string().trim().min(2,"Enter your full name").max(100),
  email:z.string().trim().email("Enter a valid email address"),
  phone:z.string().trim().min(7,"Enter a valid contact number").max(30),
  address:z.string().trim().min(8,"Enter a complete delivery address").max(300),
  city:z.string().trim().min(2,"Enter your city").max(100),
  paymentMethod:z.enum(["test_card","cash_on_delivery"]),
  cardNumber:z.string().trim().optional(),
  cardName:z.string().trim().optional(),
  expiry:z.string().trim().optional(),
  cvv:z.string().trim().optional(),
  items:z.array(z.object({productId:z.string().min(1),quantity:z.number().int().min(1).max(99)})).min(1,"Your cart is empty"),
}).superRefine((data,ctx)=>{
  if(data.paymentMethod!=="test_card")return;
  if(data.cardNumber?.replace(/\s/g,"")!=="4242424242424242")ctx.addIssue({code:"custom",path:["cardNumber"],message:"Use the test card 4242 4242 4242 4242"});
  if(!data.cardName||data.cardName.length<2)ctx.addIssue({code:"custom",path:["cardName"],message:"Enter the cardholder name"});
  if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry||""))ctx.addIssue({code:"custom",path:["expiry"],message:"Use MM/YY format"});
  if(!/^\d{3,4}$/.test(data.cvv||""))ctx.addIssue({code:"custom",path:["cvv"],message:"Enter a 3 or 4 digit security code"});
});
