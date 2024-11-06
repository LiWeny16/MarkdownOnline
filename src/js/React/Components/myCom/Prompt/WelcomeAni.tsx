// @ts-nocheck
import React, { useEffect, useRef, useState } from "react"
import { Backdrop, Button, Typography, Box } from "@mui/material"
import { gsap } from "gsap"
import { changeStatesMemorable, getStatesMemorable } from "@App/config/change"

const featuresList = [
  {
    title: "开始体验",
    description: "点击开始，探索更多功能。",
    icon: "🚀",
    isButton: true,
  },
  {
    title: "智能编辑器",
    description:
      "支持实时预览的双栏编辑器，集成智能补全和格式化功能，让写作更轻松。",
    icon: "✍️",
  },
  {
    title: "代码展示",
    description: "支持超过40种编程语言的语法高亮，内置多种主题，让代码更易读。",
    icon: "💻",
  },
  {
    title: "多端同步",
    description: "云端自动保存，多设备实时同步，随时随地继续你的创作。",
    icon: "🔄",
  },
  {
    title: "灵活导出",
    description: "一键导出为PDF、Md、Txt等多种格式，支持自定义导出模板。",
    icon: "📤",
  },
]

const WelcomeAnimation = () => {
  const welcomeRef = useRef(null)
  const featuresRefs = useRef([])
  const floatingAnimations = useRef([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] =
    useState(false)

  const getRandomFloat = (min, max) => Math.random() * (max - min) + min

  const initialCardStates = featuresList.map((feature, index) => {
    let angle
    if (feature.isButton) {
      angle = 45
    } else {
      angle = (index - (featuresList.length - 1) / 2) * 15
    }
    return {
      x: feature.isButton ? 135 : angle * 3,
      y: 0,
      rotation: angle,
      zIndex: feature.isButton ? featuresList.length + 1 : index,
    }
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsInitialAnimationComplete(true),
      })

      const buttonIndex = featuresList.findIndex((feature) => feature.isButton)

      // Initialize: only show the "Start Experience" card
      featuresRefs.current.forEach((ref, index) => {
        if (ref) {
          if (index === buttonIndex) {
            gsap.set(ref, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
            })
          } else {
            gsap.set(ref, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 0.8,
              opacity: 0,
            })
          }
        }
      })

      // Start card reveal after a short delay
      tl.add("cardsReveal", "+=0.3")

      // Reveal other cards
      featuresRefs.current.forEach((ref, index) => {
        if (ref && index !== buttonIndex) {
          let angle = (index - (featuresList.length - 1) / 2) * 15
          const delay = index * 0.15

          tl.to(
            ref,
            {
              scale: 1,
              opacity: 1,
              rotation: angle,
              x: angle * 3,
              y: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
              zIndex: index,
            },
            `cardsReveal+=${delay}`
          )

          // Add continuous floating animation
          tl.add(
            () => {
              const floatAnim = gsap.to(ref, {
                rotation: `+=${getRandomFloat(-2, 2)}`,
                duration: getRandomFloat(3, 5),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              })
              floatingAnimations.current[index] = floatAnim
            },
            `cardsReveal+=${delay + 0.8}`
          )
        }
      })

      // Move the "Start Experience" card to its position
      tl.to(
        featuresRefs.current[buttonIndex],
        {
          scale: 1,
          rotation: 45,
          x: 135,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          zIndex: featuresList.length + 1,
        },
        `cardsReveal+=${featuresRefs.current.length * 0.15}`
      )

      // Add floating animation to the "Start Experience" card
      tl.add(() => {
        const floatAnim = gsap.to(featuresRefs.current[buttonIndex], {
          y: -10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        })
        floatingAnimations.current[buttonIndex] = floatAnim
      })
    }, welcomeRef)

    return () => ctx.revert()
  }, [])

  const handleEnter = () => {
    // Ensure the state is changed immediately when the button is clicked
    changeStatesMemorable({ memorable: { welcomeAnimationState: false } })

    const tl = gsap.timeline()

    // Cards disappear animation
    featuresRefs.current.forEach((ref, index) => {
      if (ref) {
        const randomDirection = Math.random() * 360
        const distance = 100
        const x = Math.cos(randomDirection) * distance
        const y = Math.sin(randomDirection) * distance

        tl.to(
          ref,
          {
            scale: 0,
            opacity: 0,
            x,
            y,
            duration: 0.6,
            ease: "back.in(1.7)",
            delay: index * 0.1,
          },
          0
        )
      }
    })

    // Fade out background
    tl.to(
      welcomeRef.current,
      {
        opacity: 0,
        duration: 0.6,
      },
      ">-0.2"
    )
  }

  const handleCardClick = (index) => {
    if (!isInitialAnimationComplete) return

    const tl = gsap.timeline()

    if (activeIndex === index) {
      // Deactivate card
      const ref = featuresRefs.current[index]
      if (ref) {
        // Kill floating animation
        if (floatingAnimations.current[index]) {
          floatingAnimations.current[index].kill()
          floatingAnimations.current[index] = null
        }
        tl.to(ref, {
          scale: 1,
          zIndex: initialCardStates[index].zIndex,
          duration: 0.5,
          ease: "power2.out",
          x: initialCardStates[index].x,
          y: initialCardStates[index].y,
          rotation: initialCardStates[index].rotation,
          yPercent: 0,
          onComplete: () => {
            // Recreate floating animation
            const floatAnim = gsap.to(ref, {
              rotation: `+=${getRandomFloat(-2, 2)}`,
              duration: getRandomFloat(3, 5),
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            })
            floatingAnimations.current[index] = floatAnim
          },
        })
      }
      setActiveIndex(null)
    } else {
      // Deactivate previously active card
      if (activeIndex !== null && featuresRefs.current[activeIndex]) {
        const prevRef = featuresRefs.current[activeIndex]
        // Kill floating animation
        if (floatingAnimations.current[activeIndex]) {
          floatingAnimations.current[activeIndex].kill()
          floatingAnimations.current[activeIndex] = null
        }
        tl.to(
          prevRef,
          {
            scale: 1,
            zIndex: initialCardStates[activeIndex].zIndex,
            duration: 0.5,
            ease: "power2.out",
            x: initialCardStates[activeIndex].x,
            y: initialCardStates[activeIndex].y,
            rotation: initialCardStates[activeIndex].rotation,
            yPercent: 0,
            onComplete: () => {
              // Recreate floating animation
              const floatAnim = gsap.to(prevRef, {
                rotation: `+=${getRandomFloat(-2, 2)}`,
                duration: getRandomFloat(3, 5),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              })
              floatingAnimations.current[activeIndex] = floatAnim
            },
          },
          0
        )
      }

      // Activate new card
      if (featuresRefs.current[index]) {
        const currentRef = featuresRefs.current[index]
        // Kill floating animation
        if (floatingAnimations.current[index]) {
          floatingAnimations.current[index].kill()
          floatingAnimations.current[index] = null
        }
        tl.to(
          currentRef,
          {
            scale: 1.5,
            zIndex: 10,
            duration: 0.5,
            ease: "power2.out",
            x: 0,
            y: 0,
            yPercent: -50,
            rotation: 0,
          },
          0
        )
      }

      setActiveIndex(index)
    }
  }

  const handleBackgroundClick = (event) => {
    if (event.target === event.currentTarget && activeIndex !== null) {
      handleCardClick(activeIndex)
    }
  }

  return (
    <Backdrop
      ref={welcomeRef}
      open={getStatesMemorable().memorable.welcomeAnimationState}
      onClick={handleBackgroundClick}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingTop: 50,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "300px",
          height: "400px",
          perspective: "1000px",
          marginBottom: 8,
        }}
      >
        {featuresList.map((feature, index) => (
          <Box
            key={index}
            ref={(el) => (featuresRefs.current[index] = el)}
            onClick={(e) => {
              e.stopPropagation() // Prevent event bubbling to Backdrop
              if (!feature.isButton) {
                handleCardClick(index)
              }
            }}
            sx={{
              position: "absolute",
              top: -20,
              left: 0,
              width: "100%",
              height: "100%",
              padding: 3,
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              color: "#000",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transformOrigin: "center center",
              transition: "box-shadow 0.3s ease",
              zIndex: feature.isButton ? featuresList.length + 1 : index,
              "&:hover": {
                boxShadow: isInitialAnimationComplete
                  ? "0 12px 48px rgba(0, 0, 0, 0.2)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
              },
              pointerEvents: isInitialAnimationComplete ? "auto" : "none",
            }}
          >
            {feature.isButton ? (
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  handleEnter()
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 4,
                  py: 2,
                  fontSize: "1rem",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Typography variant="h5" sx={{ fontSize: "1.5rem", mb: 1 }}>
                  {feature.icon} {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {feature.description}
                </Typography>
              </Button>
            ) : (
              <>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "1.5rem",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <span>{feature.icon}</span>
                    {feature.title}
                  </Typography>
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      flexDirection: "column",
                      alignContent: "center",
                      justifyContent: "center",
                      pb:"80px"
                    }}
                  >
                    <Typography
                      alignContent={"center"}
                      variant="body2"
                      sx={{ opacity: 0.8 }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Backdrop>
  )
}

export default WelcomeAnimation
