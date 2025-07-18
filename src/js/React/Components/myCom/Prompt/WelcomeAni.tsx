// // @ts-nocheck
// import React, { useEffect, useRef, useState } from "react"
// import { Backdrop, Button, Typography, Box } from "@mui/material"
// import { gsap } from "gsap"
// import { changeStatesMemorable, getStatesMemorable } from "@App/config/change"
// import i18n from "i18next"
// import { useTranslation } from "react-i18next"
// import kit from "bigonion-kit"

// const WelcomeAnimation = () => {
//   const { t } = useTranslation()
//   const featuresList = [
//     {
//       title: t("featuresList.startExperience.title"),
//       description: t("featuresList.startExperience.description"),
//       icon: "🚀",
//       isButton: true,
//     },
//     {
//       title: t("featuresList.startExperience.title"),
//       description: t("featuresList.startExperience.description"),
//       icon: "🚀",
//       isStartCard: true,
//     },
//     {
//       title: "未完待续...",
//       description:
//         "探索，\n创新，\n永不言弃。\n\n To Explore, \nTo Innovate, \nNever give up.",
//       icon: "✨",
//     },
//     {
//       title: t("featuresList.smartEditor.title"),
//       description: t("featuresList.smartEditor.description"),
//       icon: "✍️",
//     },
//     {
//       title: t("featuresList.codeDisplay.title"),
//       description: t("featuresList.codeDisplay.description"),
//       icon: "🌍",
//     },
//     {
//       title: t("featuresList.multiDeviceSync.title"),
//       description: t("featuresList.multiDeviceSync.description"),
//       icon: "📂",
//     },
//     {
//       title: t("featuresList.flexibleExport.title"),
//       description: t("featuresList.flexibleExport.description"),
//       icon: "📤",
//     },
//   ]
//   const welcomeRef = useRef(null)
//   const featuresRefs = useRef<(HTMLDivElement | null)[]>([])
//   const floatingAnimations = useRef<(gsap.core.Tween | null)[]>([])
//   const [activeIndex, setActiveIndex] = useState<number | null>(null)
//   const [welcomeClickTimes, setWelcomeClickTimes] = useState<number>(0)
//   const [isInitialAnimationComplete, setIsInitialAnimationComplete] =
//     useState(false)

//   const getRandomFloat = (min: number, max: number) =>
//     Math.random() * (max - min) + min

//   const initialCardStates = featuresList.map((feature, index) => {
//     let angle
//     if (feature.isButton) {
//       angle = 45
//     } else {
//       angle = (index - (featuresList.length - 1) / 2) * 15
//     }
//     return {
//       x: feature.isButton ? 175 : angle * 3,
//       y: 0,
//       rotation: angle,
//       zIndex: feature.isButton ? featuresList.length + 1 : index,
//       scale: 1,
//     }
//   })
//   const handleSpreadingAnimation = () => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         onComplete: () => setIsInitialAnimationComplete(true),
//       })

//       const buttonIndex = featuresList.findIndex((feature) => feature.isButton)
//       tl.add("cardsReveal", "+=0.6")

//       tl.to(featuresRefs.current[buttonIndex], {
//         scale: 1.1, // 放大比例
//         duration: 0.5, // 放大持续时间
//         yoyo: true, // 启用 yoyo，动画结束后会反向
//         repeat: 1, // 重复一次，确保它回到原始大小
//         ease: "power1.inOut", // 动画缓动效果
//       })
//       featuresRefs.current.forEach((ref, index) => {
//         if (ref && index !== buttonIndex) {
//           let angle = (index - (featuresList.length - 1) / 2) * 15
//           const delay = index * 0.15
//           tl.to(
//             ref,
//             {
//               scale: 1,
//               opacity: 1,
//               rotation: angle,
//               x: angle * 3,
//               y: 0,
//               duration: 0.8,
//               ease: "back.out(1.7)",
//               onStart: () => {
//                 gsap.set(ref, { zIndex: index })
//               },
//             },
//             `cardsReveal+=${delay}`
//           )

//           if (index !== 0) {
//             tl.add(
//               () => {
//                 const floatAnim = gsap.to(ref, {
//                   rotation: `+=${getRandomFloat(-2, 2)}`,
//                   duration: getRandomFloat(3, 5),
//                   repeat: -1,
//                   yoyo: true,
//                   ease: "sine.inOut",
//                 })
//                 floatingAnimations.current[index] = floatAnim
//               },
//               `cardsReveal+=${delay + 0.8}`
//             )
//           }
//         }
//       })

//       tl.to(
//         featuresRefs.current[buttonIndex],
//         {
//           scale: 1.05,
//           rotation: 50,
//           x: 175,
//           y: 0,
//           duration: 0.8,
//           ease: "back.out(1.7)",
//           onStart: () => {
//             gsap.set(featuresRefs.current[buttonIndex], {
//               zIndex: featuresList.length + 1,
//             })
//           },
//           onComplete: () => {
//             const floatAnim = gsap.to(featuresRefs.current[buttonIndex], {
//               y: -10,
//               duration: 1.5,
//               repeat: -1,
//               yoyo: true,
//               ease: "power1.inOut",
//             })
//             floatingAnimations.current[buttonIndex] = floatAnim
//           },
//         },
//         `cardsReveal+=${featuresRefs.current.length * 0.15}`
//       )
//     }, welcomeRef)
//   }
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         onComplete: () => setIsInitialAnimationComplete(true),
//       })

//       const buttonIndex = featuresList.findIndex((feature) => feature.isButton)

//       featuresRefs.current.forEach((ref, index) => {
//         if (ref) {
//           if (index === buttonIndex) {
//             gsap.set(ref, {
//               x: 0,
//               y: 0,
//               rotation: 0,
//               scale: 1,
//               opacity: 1,
//               zIndex: featuresList.length + 1,
//             })
//           } else {
//             gsap.set(ref, {
//               x: 0,
//               y: 0,
//               rotation: 0,
//               scale: 0.8,
//               opacity: 0,
//               zIndex: index,
//             })
//           }
//         }
//       })
//     }, welcomeRef)

//     return () => ctx.revert()
//   }, [])

//   const handleEnter = () => {


//     const tl = gsap.timeline()

//     featuresRefs.current.forEach((ref, index) => {
//       if (ref) {
//         const randomDirection = Math.random() * 360
//         const distance = 100
//         const x = Math.cos(randomDirection) * distance
//         const y = Math.sin(randomDirection) * distance

//         tl.to(
//           ref,
//           {
//             scale: 0,
//             opacity: 0,
//             x,
//             y,
//             duration: 0.6,
//             ease: "back.in(1.7)",
//             delay: index * 0.1,
//           },
//           0
//         )
//       }
//     })

//     tl.to(
//       welcomeRef.current,
//       {
//         opacity: 0,
//         duration: 0.2,
//       },
//       ">-0.2"
//     )
//     kit.sleep(1500).then(() => {
//       changeStatesMemorable({ memorable: { welcomeAnimationState: false } })
//     })
//   }

//   const handleCardClick = (index: number) => {
//     if (!isInitialAnimationComplete) return

//     const tl = gsap.timeline()

//     if (activeIndex === index) {
//       const ref = featuresRefs.current[index]
//       if (ref) {
//         if (floatingAnimations.current[index] !== null) {
//           floatingAnimations.current[index].kill()
//           floatingAnimations.current[index] = null
//         }

//         tl.to(ref, {
//           scale: 1.1,
//           rotation: -30,
//           duration: 0.7,
//           ease: "power2.inOut",
//           x: initialCardStates[index].x - 400,
//           y: initialCardStates[index].y - 250,
//           onComplete: () => {
//             gsap.set(ref, { zIndex: initialCardStates[index].zIndex })
//           },
//         }).to(ref, {
//           scale: initialCardStates[index].scale || 1,
//           rotation: initialCardStates[index].rotation,
//           duration: 0.4,
//           ease: "power2.inOut",
//           x: initialCardStates[index].x,
//           y: initialCardStates[index].y,
//           onComplete: () => {
//             if (index === 0) {
//               const floatAnim = gsap.to(ref, {
//                 rotation: `+=${getRandomFloat(-2, 2)}`,
//                 duration: getRandomFloat(3, 5),
//                 repeat: -1,
//                 yoyo: true,
//                 ease: "sine.inOut",
//               })
//               floatingAnimations.current[index] = floatAnim
//             }
//             if (featuresList[index].isStartCard) {
//               handleEnter()
//             }
//           },
//         })
//       }
//       setActiveIndex(null)
//     } else {
//       if (activeIndex !== null && featuresRefs.current[activeIndex]) {
//         const prevRef = featuresRefs.current[activeIndex]
//         if (floatingAnimations.current[activeIndex]) {
//           floatingAnimations.current[activeIndex].kill()
//           floatingAnimations.current[activeIndex] = null
//         }
//         gsap.set(prevRef, { zIndex: initialCardStates[activeIndex].zIndex })

//         tl.to(
//           prevRef,
//           {
//             scale: initialCardStates[activeIndex].scale || 1,
//             rotation: initialCardStates[activeIndex].rotation,
//             duration: 0.8,
//             ease: "power2.inOut",
//             x: initialCardStates[activeIndex].x,
//             y: initialCardStates[activeIndex].y,
//             onComplete: () => {
//               if (activeIndex === 0) {
//                 const floatAnim = gsap.to(prevRef, {
//                   rotation: `+=${getRandomFloat(-2, 2)}`,
//                   duration: getRandomFloat(3, 5),
//                   repeat: -1,
//                   yoyo: true,
//                   ease: "sine.inOut",
//                 })
//                 floatingAnimations.current[activeIndex] = floatAnim
//               }
//             },
//           },
//           0
//         )
//       }

//       if (featuresRefs.current[index]) {
//         const currentRef = featuresRefs.current[index]

//         if (floatingAnimations.current[index]) {
//           floatingAnimations.current[index].kill()
//           floatingAnimations.current[index] = null
//         }

//         const calculateScale = () => {
//           const viewportWidth = window.innerWidth
//           const viewportHeight = window.innerHeight
//           const cardWidth = 300
//           const cardHeight = 400
//           const maxScaleWidth = (0.8 * viewportWidth) / cardWidth
//           const maxScaleHeight = (0.8 * viewportHeight) / cardHeight
//           const scale = Math.min(maxScaleWidth, maxScaleHeight, 2)
//           return scale < 1 ? 1 : scale
//         }

//         const scale = calculateScale()

//         gsap.set(currentRef, { zIndex: 100 })

//         tl.to(
//           currentRef,
//           {
//             scale: scale,
//             x: -300,
//             y: -50,
//             rotation: 0,
//             duration: 0.5,
//             ease: "power2.out",
//             onComplete: () => {
//               gsap.set(currentRef, { yPercent: 0 })
//               if (index === 0) {
//                 if (floatingAnimations.current[index]) {
//                   floatingAnimations.current[index].kill()
//                   floatingAnimations.current[index] = null
//                 }
//               }
//             },
//           },
//           0
//         )
//       }

//       setActiveIndex(index)
//     }
//   }

//   const handleBackgroundClick = (
//     event: React.MouseEvent<HTMLDivElement, MouseEvent>
//   ) => {
//     if (event.target === event.currentTarget && activeIndex !== null) {
//       handleCardClick(activeIndex)
//     }
//   }

//   return (
//     <Backdrop
//       ref={welcomeRef}
//       open={getStatesMemorable().memorable.welcomeAnimationState}
//       onClick={handleBackgroundClick}
//       sx={{
//         zIndex: (theme) => theme.zIndex.drawer + 1,
//         backgroundColor: "#f5f5f5",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 4,
//         paddingTop: 30,
//         overflow: "hidden",
//       }}
//     >
//       <Box
//         sx={{
//           position: "relative",
//           width: "300px",
//           height: "400px",
//           perspective: "1000px",
//           userSelect: "none",
//           marginBottom: 8,
//         }}
//       >
//         {featuresList.map((feature, index) => (
//           <Box
//             key={index}
//             ref={(el: HTMLDivElement | null) =>
//               (featuresRefs.current[index] = el)
//             }
//             onClick={(e) => {
//               e.stopPropagation()
//               if (!feature.isButton) {
//                 handleCardClick(index)
//               } else {
//                 // handleEnter()
//               }
//             }}
//             sx={{
//               position: "absolute",
//               top: -20,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               padding: 3,
//               borderRadius: "12px",
//               backgroundColor: "#ffffff",
//               color: "#000",
//               boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
//               cursor: "pointer",
//               transformOrigin: "center center",
//               transition: "box-shadow 0.3s ease",
//               "&:hover": {
//                 boxShadow: isInitialAnimationComplete
//                   ? "0 12px 48px rgba(0, 0, 0, 0.2)"
//                   : "0 8px 32px rgba(0, 0, 0, 0.1)",
//               },
//               pointerEvents: isInitialAnimationComplete ? "auto" : "none",
//               minWidth: feature.isButton ? "300px" : "200px",
//               minHeight: feature.isButton ? "400px" : "250px",
//               maxWidth: "80vw",
//               maxHeight: "80vh",
//               willChange: "transform, opacity",
//             }}
//           >
//             {feature.isButton ? (
//               <Button
//                 variant="contained"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   e.stopPropagation() // 防止事件冒泡
//                   if (welcomeClickTimes == 0) {
//                     handleSpreadingAnimation()
//                     setWelcomeClickTimes(1)
//                   } else {
//                     const tl = gsap.timeline()

//                     const ref = featuresRefs.current[index]
//                     gsap.set(ref.parentNode, { perspective: 800 })
//                     tl.to(ref, {
//                       scale: 1.15, // 中间点放大一些
//                       duration: 0.7, // 设置较短的持续时间，保证这是动画的中间点
//                       ease: "power2.inOut",
//                     }).to(ref, {
//                       scale: 0, // 中间点放大一些
//                       duration: 0.7, // 设置较短的持续时间，保证这是动画的中间点
//                       opacity: 0,
//                       ease: "power2.inOut",

//                       onComplete: () => {
//                         gsap.to(ref, {
//                           duration: 0.2,
//                           onComplete: () => {
//                             gsap.set(ref, { display: "none" })
//                           },
//                         })
//                       },
//                     })
//                   }
//                 }}
//                 sx={{
//                   width: "100%",
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   px: 4,
//                   py: 2,
//                   fontSize: "1rem",
//                   backgroundColor: "#1976d2",
//                   color: "#fff",
//                   borderRadius: "12px",
//                   "&:hover": {
//                     backgroundColor: "#1565c0",
//                     transform: "translateY(-2px)",
//                   },
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 <Typography
//                   variant="h5"
//                   sx={{ whiteSpace: "pre-line", fontSize: "1.5rem", mb: 1 }}
//                 >
//                   {feature.icon} {feature.title}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   sx={{ whiteSpace: "pre-line", opacity: 0.8 }}
//                 >
//                   {feature.description}
//                 </Typography>
//               </Button>
//             ) : feature.isStartCard ? (
//               <>
//                 <Box
//                   sx={{
//                     height: "100%",
//                     width: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Button
//                     variant="contained"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleCardClick(index)
//                     }}
//                     sx={{
//                       width: "100%",
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       px: 4,
//                       py: 2,
//                       fontSize: "1rem",
//                       backgroundColor: "#FFDDEE",
//                       color: "#fff",
//                       borderRadius: "12px",
//                       "&:hover": {
//                         backgroundColor: "#ffc3e1",
//                         transform: "translateY(-2px)",
//                       },
//                       transition: "all 0.3s ease",
//                     }}
//                   >
//                     <Typography
//                       variant="h5"
//                       sx={{ whiteSpace: "pre-line", fontSize: "1.5rem", mb: 1 }}
//                     >
//                       {feature.icon} {feature.title}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ whiteSpace: "pre-line", opacity: 0.8 }}
//                     >
//                       {feature.description}
//                     </Typography>
//                   </Button>
//                 </Box>
//               </>
//             ) : (
//               <>
//                 <Box
//                   sx={{
//                     height: "100%",
//                     width: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Typography
//                     variant="h5"
//                     sx={{
//                       fontSize: "1.5rem",
//                       mb: 1,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 2,
//                       whiteSpace: "pre-line",
//                     }}
//                   >
//                     <span>{feature.icon}</span>
//                     {feature.title}
//                   </Typography>
//                   <Box
//                     sx={{
//                       height: "100%",
//                       width: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       alignContent: "center",
//                       justifyContent: "center",
//                       pb: "80px",
//                     }}
//                   >
//                     <Typography
//                       alignContent={"center"}
//                       variant="body2"
//                       sx={{ whiteSpace: "pre-line", opacity: 0.8 }}
//                     >
//                       {feature.description}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </>
//             )}
//           </Box>
//         ))}
//       </Box>
//     </Backdrop>
//   )
// }

// export default WelcomeAnimation
