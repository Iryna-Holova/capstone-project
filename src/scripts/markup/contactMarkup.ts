import { Contact } from "../types/propertyParts";
import spriteUrl from "../../assets/sprite.svg";

export const contactMarkup = (contact: Contact): string =>
  `<h3>Contact</h3>
    <div>
      <span>${contact.name}</span>
      <span>${contact.type}</span></div>
    <ul>
      <li><a href="tel:${contact.phone
        .split("")
        .filter((c) => c.match(/[0-9,+]/))
        .join("")}">
        <svg width="32" height="32"><use href="${spriteUrl}#icon-phone" /></svg>
        <span>Call</span></a>
      </li>
      <li><a href="mailto:${contact.email}">
        <svg width="32" height="32"><use href="${spriteUrl}#icon-mail" /></svg>
        <span>Email</span></a>
      </li>
    </ul>`;
