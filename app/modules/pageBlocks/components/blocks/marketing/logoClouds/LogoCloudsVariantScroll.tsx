import { InfiniteSlider } from "~/components/motion-primitives/infinite-slider";
import { ProgressiveBlur } from "~/components/motion-primitives/progressive-blur";
import { LogoCloudDto } from "~/modules/pageBlocks/components/blocks/marketing/logoClouds/LogoCloudsBlockUtils";

import LogoReact from "~/assets/logos/colors/react.png";
import LogoTailwind from "~/assets/logos/colors/tailwindcss.png";
import LogoPrisma from "~/assets/logos/colors/prisma.png";
import LogoPrismaDark from "~/assets/logos/colors/prisma-dark.png";
import LogoStripe from "~/assets/logos/colors/stripe.png";
import LogoPostmark from "~/assets/logos/colors/postmark.png";
import LogoRemix from "~/assets/logos/colors/remix.png";
import LogoRemixDark from "~/assets/logos/colors/remix-dark.png";
import LogoTypescript from "~/assets/logos/colors/typescript.png";
import LogoVite from "~/assets/logos/colors/vite.png";
import { cn } from "~/lib/utils";
import StripeIcon from "~/components/ui/icons/StripeIcon";
import { Link } from "react-router";

export default function LogoCloudsVariantScroll({ items }: { items: LogoCloudDto[] }) {
  return (
    <section className="overflow-hidden">
      <div className="group relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          {/* <div className="md:max-w-44 md:border-r md:pr-6">
            <p className="text-end text-sm">THE web tools</p>
          </div> */}
          <div className="relative w-full py-6">
            <InfiniteSlider speedOnHover={20} speed={40} gap={150}>
              {/* {items.map((item) => (
                <div className="flex items-center">
                  <img className="mx-auto h-12 w-fit " src={item.src} alt={item.alt} height="20" width="auto" />
                </div>
              ))} */}
              {/* <div>
                <svg className="h-12 w-fit" xmlns="http://www.w3.org/2000/svg" width="1500" height="489" fill="none">
                  <path
                    fill="#000"
                    d="M25.41 393.747h63.522v-99.519h53.36l49.971 99.519h70.299l-58.441-114.341c30.914-14.822 50.818-45.313 50.818-83.427 0-60.135-43.619-98.673-108.836-98.673H25.409v296.441ZM141.02 150.242c30.068 0 49.125 17.787 49.125 45.737 0 27.527-19.057 45.313-49.125 45.313H88.932v-91.05h52.089ZM388.86 396.288c58.018 0 95.708-33.879 102.484-76.227h-58.865c-5.081 20.327-22.021 30.914-46.16 30.914-30.067 0-49.971-18.633-51.242-49.548v-2.964h157.961c1.27-6.776 1.694-13.975 1.694-20.328-.847-63.946-44.89-104.601-110.107-104.601-67.334 0-111.8 44.043-111.8 111.801 0 67.334 43.619 110.953 116.035 110.953Zm-52.512-136.786C339.736 233.669 359.216 218 385.049 218c27.103 0 45.313 14.822 49.548 41.502h-98.249Zm179.198 61.829c2.541 46.584 43.619 74.957 104.177 74.957 58.442 0 99.096-27.526 99.096-70.722 0-49.125-41.501-60.559-91.473-65.641-31.338-3.811-49.971-5.505-49.971-22.021 0-13.975 15.245-22.445 38.537-22.445 24.139 0 40.655 10.587 42.349 27.95h57.17c-2.964-44.466-43.195-70.298-101.636-70.298-55.901-.424-93.591 27.95-93.591 71.145 0 44.89 39.384 56.324 90.203 62.253 35.149 4.658 49.971 5.929 49.971 23.715 0 15.246-15.245 23.292-40.231 23.292-29.221 0-45.737-13.128-47.854-32.185h-56.747Zm342.293 74.957c58.018 0 95.708-33.879 102.484-76.227h-58.865c-5.082 20.327-22.021 30.914-46.16 30.914-30.068 0-49.972-18.633-51.242-49.548v-2.964h157.961c1.27-6.776 1.694-13.975 1.694-20.328-.847-63.946-44.89-104.601-110.107-104.601-67.334 0-111.801 44.043-111.801 111.801 0 67.334 43.62 110.953 116.036 110.953Zm-52.513-136.786C808.714 233.669 828.195 218 854.027 218c27.104 0 45.314 14.822 49.548 41.502h-98.249Zm315.944-85.968c-33.45 0-53.36 12.705-67.33 29.644l-5.51-27.103h-52.088v217.672h59.708V282.37c0-37.69 17.79-59.711 48.7-59.711 30.07 0 44.05 19.48 44.05 56.323v114.765h59.71V273.054c0-74.534-40.23-99.52-87.24-99.52Zm282 29.644c-13.98-17.786-35.58-29.644-65.64-29.644-58.02 0-100.79 43.619-100.79 110.954 0 69.028 42.77 111.8 101.21 111.8 31.34 0 52.51-13.975 66.91-32.608l5.93 30.067h52.09V97.307h-59.71v105.871Zm-52.09 144.409c-32.61 0-53.36-25.409-53.36-62.676s20.75-62.676 53.36-62.676 52.93 25.833 52.93 63.1c0 36.843-20.32 62.252-52.93 62.252Z"
                  />
                </svg>
              </div> */}

              {/* <div className="flex items-center">
                <img className="mx-auto h-12 " src={LogoReact} alt="React Logo" height="20" width="auto" />
              </div> */}

              <div className="flex items-center">
                {/* <img className="mx-auto h-12 " src={LogoTailwind} alt="Tailwind CSS Logo" height="20" width="auto" /> */}
                <svg
                  className={cn("mx-auto h-12 w-fit text-[#38BDF9] dark:text-[#38BDF9]")}
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  width="800"
                  height="800"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 6.036c-2.667 0-4.333 1.325-5 3.976 1-1.325 2.167-1.822 3.5-1.491.761.189 1.305.738 1.906 1.345C13.387 10.855 14.522 12 17 12c2.667 0 4.333-1.325 5-3.976-1 1.325-2.166 1.822-3.5 1.491-.761-.189-1.305-.738-1.907-1.345-.98-.99-2.114-2.134-4.593-2.134zM7 12c-2.667 0-4.333 1.325-5 3.976 1-1.326 2.167-1.822 3.5-1.491.761.189 1.305.738 1.907 1.345.98.989 2.115 2.134 4.594 2.134 2.667 0 4.333-1.325 5-3.976-1 1.325-2.167 1.822-3.5 1.491-.761-.189-1.305-.738-1.906-1.345C10.613 13.145 9.478 12 7 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="flex items-center">
                <svg className="mx-auto h-8 w-fit" xmlns="http://www.w3.org/2000/svg" width="602" height="360" fill="none" viewBox="0 0 602 360">
                  <path
                    fill="#F44250"
                    d="M481.36 180c0 16.572-6.721 31.572-17.603 42.42C452.875 233.28 437.845 240 421.24 240c-16.605 0-31.635 6.708-42.505 17.568-10.882 10.86-17.615 25.86-17.615 42.432 0 16.572-6.721 31.572-17.603 42.42C332.635 353.28 317.605 360 301 360c-16.605 0-31.635-6.72-42.505-17.58-10.882-10.848-17.615-25.848-17.615-42.42 0-16.572 6.733-31.572 17.615-42.432C269.365 246.708 284.395 240 301 240c16.605 0 31.635-6.72 42.517-17.58 10.882-10.848 17.603-25.848 17.603-42.42 0-33.144-26.91-60-60.12-60-16.605 0-31.635-6.72-42.505-17.58C247.613 91.572 240.88 76.572 240.88 60c0-16.572 6.733-31.572 17.615-42.432C269.365 6.708 284.395 0 301 0c33.21 0 60.12 26.856 60.12 60 0 16.572 6.733 31.572 17.615 42.42 10.87 10.86 25.9 17.58 42.505 17.58 33.21 0 60.12 26.856 60.12 60Z"
                  />
                  <path
                    fill="currentColor"
                    d="M240.88 180c0-33.138-26.916-60-60.12-60-33.203 0-60.12 26.862-60.12 60 0 33.137 26.917 60 60.12 60 33.204 0 60.12-26.863 60.12-60ZM120.64 300c0-33.137-26.917-60-60.12-60C27.317 240 .4 266.863.4 300c0 33.138 26.917 60 60.12 60 33.203 0 60.12-26.862 60.12-60ZM601.6 300c0-33.137-26.917-60-60.12-60-33.203 0-60.12 26.863-60.12 60 0 33.138 26.917 60 60.12 60 33.203 0 60.12-26.862 60.12-60Z"
                  />
                </svg>
                {/* <img className="mx-auto h-12 w-fit dark:hidden" src={LogoRemix} alt="Remix Logo" height="20" width="auto" />
                <img className="hidden h-12 w-fit dark:block" src={LogoRemixDark} alt="Remix Logo" height="20" width="auto" /> */}
              </div>
              <div className="flex items-center">
                <svg className="h-10 w-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="32" width="32">
                  <path fill="none" d="M0 0h256v256H0z" />
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" d="m208 128-80 80M192 40 40 192" />
                </svg>
              </div>
              <div className="flex items-center">
                {/* <img className="mx-auto h-12 w-fit dark:hidden" src={LogoPrisma} alt="Prisma Logo" height="20" width="auto" />
                <img className="hidden h-12 w-fit dark:block" src={LogoPrismaDark} alt="Prisma Logo" height="20" width="auto" /> */}
                <svg className={cn("h-10 text-black dark:text-white")} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path
                    d="m25.21 24.21-12.471 3.718a.525.525 0 0 1-.667-.606l4.456-21.511a.43.43 0 0 1 .809-.094l8.249 17.661a.6.6 0 0 1-.376.832Zm2.139-.878L17.8 2.883A1.531 1.531 0 0 0 16.491 2a1.513 1.513 0 0 0-1.4.729L4.736 19.648a1.592 1.592 0 0 0 .018 1.7l5.064 7.909a1.628 1.628 0 0 0 1.83.678l14.7-4.383a1.6 1.6 0 0 0 1-2.218Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex items-center">
                <StripeIcon className="mx-auto h-7 w-fit text-[#645cfc]" />
                {/* <img className="mx-auto h-12 w-fit " src={LogoStripe} alt="Stripe Logo" height="20" width="auto" /> */}
              </div>
              <div className="flex items-center">
                {/* <img className="mx-auto h-12 w-fit " src={LogoPostmark} alt="Postmark Logo" height="20" width="auto" /> */}
                <svg
                  className={cn("mx-auto h-10 w-fit text-[#FFDD04] dark:text-[#FFDD04]")}
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="32"
                  height="32"
                  viewBox="0 0 64 64"
                  fill="currentColor"
                >
                  <defs>
                    <rect id="b" width="96" height="96" x="16" y="16" rx="2" />
                    <path
                      id="a"
                      d="M128 117v6a5 5 0 0 0-5 5h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0H5a5 5 0 0 0-5-5v-6a5 5 0 1 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10V5a5 5 0 0 0 5-5h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 1 0 10 0h6a5 5 0 0 0 5 5v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10z"
                    />
                  </defs>
                  <g fill="currentColor" fillRule="evenodd" transform="matrix(.4923 0 0 .4923 .492 .492)">
                    <use xlinkHref="#a" fill="#f0f0f0" />
                    <path
                      stroke="#ccc"
                      d="M128.5 116.5v7h-.5a4.5 4.5 0 0 0-4.5 4.5v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-4.5-4.5h-.5v-7H0a4.5 4.5 0 0 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0A4.5 4.5 0 0 0 4.5 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 0 0 9 0v-.5h7V0a4.5 4.5 0 0 0 4.5 4.5h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9z"
                    />
                    <path
                      stroke="#fff"
                      d="M127.5 117.478a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956V5.478A5.502 5.502 0 0 1 122.522.5h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0H5.478A5.502 5.502 0 0 1 .5 5.478v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.502 5.502 0 0 1 4.978 4.978h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.502 5.502 0 0 1 4.978-4.978z"
                    />
                    <use xlinkHref="#b" fill="#fedd00" />
                    <rect width="95" height="95" x="16.5" y="16.5" stroke="#d9b500" rx="2" />
                    <rect width="97" height="97" x="15.5" y="15.5" stroke="#726510" rx="2" />
                    <path
                      fill="#000"
                      d="M50.3 86.084V42.3H43V35h25.886c16.168 0 19.522 10.664 19.522 18.06 0 5.934-2.408 10.492-4.902 12.986-4.042 4.042-9.546 4.988-17.888 4.988h-6.536v15.05h7.654v7.3H43v-7.3zm8.772-22.102h7.3c10.75 0 13.072-4.988 13.072-11.008 0-6.88-3.87-10.664-10.32-10.664H59.082z"
                    />
                  </g>
                </svg>
              </div>

              <div className="flex items-center">
                {/* SendGrid */}
                {/* <svg className="mx-auto h-12" xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 120 60">
                  <path
                    fill="currentColor"
                    d="m40.973 34.43 2.3-1.81c.644 1.134 1.686 1.778 2.882 1.778 1.288 0 1.993-.828 1.993-1.748 0-1.104-1.318-1.44-2.76-1.87-1.778-.552-3.77-1.226-3.77-3.802 0-2.146 1.87-3.832 4.415-3.832 2.177 0 3.403.828 4.476 1.932l-2.085 1.594c-.552-.828-1.318-1.257-2.36-1.257-1.196 0-1.81.644-1.81 1.472 0 1.012 1.288 1.38 2.698 1.84 1.81.583 3.832 1.38 3.832 3.924 0 2.116-1.686 4.14-4.6 4.14-2.39.03-4.016-.98-5.212-2.36zm20.39-6.898h2.483v1.012a3.158 3.158 0 0 1 2.514-1.196c2.146 0 3.434 1.38 3.434 3.74v5.55h-2.545v-5.212c0-1.226-.552-1.932-1.686-1.932-.95 0-1.717.644-1.717 2.177v4.967H61.36zm9.014 4.568c0-3.22 2.36-4.752 4.415-4.752 1.196 0 2.116.43 2.73 1.073v-5.09h2.483v13.306H77.52v-1.012c-.613.705-1.564 1.196-2.76 1.196-1.932 0-4.384-1.533-4.384-4.722zm7.205-.03c0-1.35-.98-2.453-2.33-2.453a2.4 2.4 0 0 0-2.453 2.453 2.38 2.38 0 0 0 2.453 2.453c1.35 0 2.33-1.104 2.33-2.453zm3.005-2.085c0-3.802 2.85-6.837 6.806-6.837 1.962 0 3.618.705 4.814 1.84.49.46.89.98 1.226 1.564l-2.207 1.35c-.828-1.502-2.085-2.3-3.802-2.3-2.422 0-4.292 1.993-4.292 4.384 0 2.453 1.84 4.384 4.384 4.384 1.932 0 3.31-1.104 3.77-2.8h-4.17v-2.422h6.898v1.012c0 3.556-2.545 6.653-6.5 6.653-4.17 0-6.93-3.158-6.93-6.837zm14.042-2.453H97.1v1.502c.46-.95 1.288-1.502 2.514-1.502h1.012l-.92 2.422h-.675c-1.318 0-1.9.705-1.9 2.39v4.292h-2.514zm6.653 0h2.483v9.106h-2.483v-6.684h-.92zm1.257-1.38c.828 0 1.502-.675 1.502-1.502s-.675-1.502-1.502-1.502-1.502.675-1.502 1.502.675 1.502 1.502 1.502zm1.84 5.948c0-3.22 2.36-4.752 4.415-4.752 1.196 0 2.115.43 2.73 1.073v-5.09h2.483v13.306h-2.483v-1.012c-.613.705-1.564 1.196-2.76 1.196-1.932 0-4.384-1.533-4.384-4.722zm7.205-.03c0-1.35-.98-2.453-2.33-2.453a2.4 2.4 0 0 0-2.453 2.453 2.38 2.38 0 0 0 2.453 2.453c1.35 0 2.33-1.104 2.33-2.453zm-50.803 0c0-2.637-1.9-4.722-4.69-4.722-2.637 0-4.752 2.116-4.752 4.752s1.962 4.752 4.814 4.752c1.962 0 3.373-.95 4.17-2.3l-1.993-1.196c-.43.797-1.226 1.318-2.177 1.318-1.318 0-2.146-.644-2.422-1.656h7.02v-.95zm-6.93-1.104c.368-.858 1.196-1.44 2.238-1.44s1.84.49 2.177 1.44z"
                  />
                  <path fill="#fff" d="M5.996 24.96h10.02v10.02H5.996z" />
                  <path fill="#99e1f4" d="M5.996 24.96h10.02v10.02H5.996z" />
                  <path fill="#fff" d="M16.016 34.98h9.963v9.963h-9.963z" />
                  <path fill="#99e1f4" d="M16.016 34.98h9.963v9.963h-9.963z" />
                  <path fill="#1a82e2" d="M5.996 44.944h10.02v.058H5.996zm0-9.964h10.02v9.963H5.996z" />
                  <path fill="#00b3e3" d="M16.016 14.998h9.963v9.963h-9.963zM25.98 25.02H36v9.963H25.98z" />
                  <path fill="#009dd9" d="M25.98 34.98V24.96h-9.963v10.02z" />
                  <g fill="#1a82e2">
                    <path d="M25.98 14.998H36v9.963H25.98z" />
                    <path d="M25.98 24.96H36v.058H25.98z" />
                  </g>
                </svg> */}
                <svg className="mx-auto h-8 w-fit" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                  <path fill="#fff" d="M0 21.25h21.374v21.374H0z" />
                  <path fill="#99e1f4" d="M0 21.25h21.374v21.374H0z" />
                  <path fill="#fff" d="M21.374 42.626h21.25v21.25h-21.25z" />
                  <path fill="#99e1f4" d="M21.374 42.626h21.25v21.25h-21.25z" />
                  <path fill="#1a82e2" d="M0 63.877h21.374V64H0zm0-21.25h21.374v21.25H0z" />
                  <path fill="#00b3e3" d="M21.374 0h21.25v21.25h-21.25zm21.252 21.374H64v21.25H42.626z" />
                  <path fill="#009dd9" d="M21.374 42.626h21.25V21.25h-21.25z" />
                  <g fill="#1a82e2">
                    <path d="M42.626 0H64v21.25H42.626zM42.626 21.25H64v.123H42.626z" />
                  </g>
                </svg>
              </div>

              <div className="flex items-center">
                <svg className="mx-auto h-12 w-fit" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 600 600">
                  <path
                    fill="currentColor"
                    d="M186 447.471V154h132.062c18.726 0 35.635 4.053 50.728 12.158 15.373 8.105 27.391 19.285 36.055 33.54 8.665 13.974 12.997 29.906 12.997 47.793 0 18.447-4.332 35.077-12.997 49.89-8.664 14.534-20.543 25.994-35.636 34.378-15.092 8.385-32.142 12.578-51.147 12.578h-64.145v103.134H186Zm162.667 0L274.041 314.99l72.949-10.481L430 447.471h-81.333Zm-94.75-157.636h57.856c7.267 0 13.556-1.537 18.866-4.612 5.59-3.354 9.782-7.965 12.577-13.835 3.075-5.869 4.612-12.577 4.612-20.123 0-7.547-1.677-14.115-5.031-19.705-3.354-5.869-8.245-10.341-14.673-13.416-6.149-3.074-13.696-4.611-22.64-4.611h-51.567v76.302Z"
                  />
                </svg>
              </div>

              {/* <div className="flex items-center">
                <img className="mx-auto h-12 w-fit " src={LogoTypescript} alt="Typescript Logo" height="20" width="auto" />
              </div>
              <div className="flex items-center">
                <img className="mx-auto h-12 w-fit " src={LogoVite} alt="Vite Logo" height="20" width="auto" />
              </div> */}
            </InfiniteSlider>

            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
            <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-20" direction="left" blurIntensity={1} />
            <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-20" direction="right" blurIntensity={1} />
          </div>
        </div>
      </div>
    </section>
  );
}
