import oct0 from "~/assets/symbols/0.svg";
import oct1 from "~/assets/symbols/1.svg";
import oct2 from "~/assets/symbols/2.svg";
import oct3 from "~/assets/symbols/3.svg";
import oct4 from "~/assets/symbols/4.svg";
import oct5 from "~/assets/symbols/5.svg";
import oct6 from "~/assets/symbols/6.svg";
import oct7 from "~/assets/symbols/7.svg";

export const oct = [oct0, oct1, oct2, oct3, oct4, oct5, oct6, oct7];

export const symbolForOct = (n: number) => oct[n % 8];
