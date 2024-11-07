// @ts-nocheck
import React, { useEffect, useRef, useState } from "react"
import { Backdrop, Button, Typography, Box } from "@mui/material"
import { gsap } from "gsap"
import { changeStatesMemorable, getStatesMemorable } from "@App/config/change"
import i18n from "i18next"
import { useTranslation } from "react-i18next"

const WelcomeAnimation = () => {
  const { t } = useTranslation()
  const featuresList = [
    {
      title: t("featuresList.startExperience.title"),
      description: t("featuresList.startExperience.description"),
      icon: "🚀",
      isButton: true,
    },
    {
      title: "未完待续...",
      description:
        "探索，\n创新，\n永不言弃。\n\n To Explore, \nTo Innovate, \nNever give up.",
      icon: "✨",
    },
    {
      title: t("featuresList.smartEditor.title"),
      description: t("featuresList.smartEditor.description"),
      icon: "✍️",
    },
    {
      title: t("featuresList.codeDisplay.title"),
      description: t("featuresList.codeDisplay.description"),
      icon: "🌍",
    },
    {
      title: t("featuresList.multiDeviceSync.title"),
      description: t("featuresList.multiDeviceSync.description"),
      icon: "📂",
    },
    {
      title: t("featuresList.flexibleExport.title"),
      description: t("featuresList.flexibleExport.description"),
      icon: "📤",
    },
  ]
  const welcomeRef = useRef(null)
  const featuresRefs = useRef<(HTMLDivElement | null)[]>([])
  const floatingAnimations = useRef<(gsap.core.Tween | null)[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] =
    useState(false)

  const getRandomFloat = (min: number, max: number) =>
    Math.random() * (max - min) + min

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
      scale: 1,
    }
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsInitialAnimationComplete(true),
      })

      const buttonIndex = featuresList.findIndex((feature) => feature.isButton)

      // 初始化：仅显示“开始体验”卡片
      featuresRefs.current.forEach((ref, index) => {
        if (ref) {
          if (index === buttonIndex) {
            gsap.set(ref, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              zIndex: featuresList.length + 1, // 设置初始 zIndex
            })
          } else {
            gsap.set(ref, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 0.8,
              opacity: 0,
              zIndex: index, // 设置初始 zIndex
            })
          }
        }
      })

      // 短暂延迟后开始卡片展示
      tl.add("cardsReveal", "+=0.6")

      // 展示其他卡片
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
              onStart: () => {
                // 在动画开始前设置 zIndex
                gsap.set(ref, { zIndex: index })
              },
            },
            `cardsReveal+=${delay}`
          )

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

      // 移动“开始体验”卡片到其位置
      tl.to(
        featuresRefs.current[buttonIndex],
        {
          scale: 1.05,
          rotation: 50,
          x: 175,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          onStart: () => {
            // 在动画开始前设置 zIndex
            gsap.set(featuresRefs.current[buttonIndex], {
              zIndex: featuresList.length + 1,
            })
          },
          onComplete: () => {
            // 为“开始体验”卡片添加浮动动画
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
          },
        },
        `cardsReveal+=${featuresRefs.current.length * 0.15}`
      )
    }, welcomeRef)

    return () => ctx.revert()
  }, [])

  const handleEnter = () => {
    // 确保点击按钮时立即更改状态
    changeStatesMemorable({ memorable: { welcomeAnimationState: false } })

    const tl = gsap.timeline()

    // 卡片消失动画
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

    // 背景淡出
    tl.to(
      welcomeRef.current,
      {
        opacity: 0,
        duration: 0.2,
      },
      ">-0.2"
    )
  }

  const handleCardClick = (index: number) => {
    if (!isInitialAnimationComplete) return

    const tl = gsap.timeline()

    if (activeIndex === index) {
      // 取消激活卡片
      const ref = featuresRefs.current[index]
      if (ref) {
        // 终止浮动动画
        if (floatingAnimations.current[index] !== null) {
          floatingAnimations.current[index].kill()
          floatingAnimations.current[index] = null
        }

        // 动画路径：斜着插回去
        tl.to(ref, {
          scale: 1.1, // 中间点放大一些
          rotation: -30,
          duration: 0.7, // 设置较短的持续时间，保证这是动画的中间点
          ease: "power2.inOut",
          x: initialCardStates[index].x - 400, // 中间位置移动到一半
          y: initialCardStates[index].y - 250,
          onComplete: () => {
            // 先调整 zIndex 到收起状态
            gsap.set(ref, { zIndex: initialCardStates[index].zIndex })
          },
        }).to(ref, {
          scale: initialCardStates[index].scale || 1, // 最终状态
          rotation: initialCardStates[index].rotation,
          duration: 0.4, // 剩余持续时间
          ease: "power2.inOut",
          x: initialCardStates[index].x,
          y: initialCardStates[index].y,
        })
      }
      setActiveIndex(null)
    } else {
      // 取消之前激活的卡片
      if (activeIndex !== null && featuresRefs.current[activeIndex]) {
        const prevRef = featuresRefs.current[activeIndex]
        // 终止浮动动画
        if (floatingAnimations.current[activeIndex]) {
          floatingAnimations.current[activeIndex].kill()
          floatingAnimations.current[activeIndex] = null
        }
        // 先调整 zIndex 到初始值
        gsap.set(prevRef, { zIndex: initialCardStates[activeIndex].zIndex })

        // 动画路径：斜着插回去
        tl.to(
          prevRef,
          {
            scale: initialCardStates[activeIndex].scale || 1,
            rotation: initialCardStates[activeIndex].rotation,
            duration: 0.8,
            ease: "power2.inOut",
            x: initialCardStates[activeIndex].x,
            y: initialCardStates[activeIndex].y,
          },
          0
        )
      }

      // 激活新的卡片
      if (featuresRefs.current[index]) {
        const currentRef = featuresRefs.current[index]

        // 终止当前卡片的浮动动画
        if (floatingAnimations.current[index]) {
          floatingAnimations.current[index].kill()
          floatingAnimations.current[index] = null
        }

        // 动态计算缩放比例，确保卡片不会过大或过小
        const calculateScale = () => {
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          const cardWidth = 300 // 原始宽度
          const cardHeight = 400 // 原始高度
          const maxScaleWidth = (0.8 * viewportWidth) / cardWidth
          const maxScaleHeight = (0.8 * viewportHeight) / cardHeight
          const scale = Math.min(maxScaleWidth, maxScaleHeight, 2) // 限制最大缩放为2
          return scale < 1 ? 1 : scale // 确保缩放不小于1
        }

        const scale = calculateScale()

        // 先设置 zIndex 再进行动画
        gsap.set(currentRef, { zIndex: 100 })

        tl.to(
          currentRef,
          {
            scale: scale,
            x: -300,
            y: -50,
            rotation: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              // 取消 yPercent 以确保居中
              gsap.set(currentRef, { yPercent: 0 })
            },
          },
          0
        )
      }

      setActiveIndex(index)
    }
  }

  const handleBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget && activeIndex !== null) {
      handleCardClick(activeIndex)
    }
  }

  // // 新增：处理鼠标进入卡片时的动画
  // const handleMouseEnter = (e: React.MouseEvent, index: number) => {
  //   e.stopPropagation()
  //   e.preventDefault()
  //   const ref = featuresRefs.current[index]
  //   if (ref) {
  //     gsap.to(ref, {
  //       scale: 1,
  //       y: -20,
  //       duration: 0.8,
  //       ease: "power2.out",
  //     })
  //   }
  // }

  // // 新增：处理鼠标离开卡片时的动画
  // const handleMouseLeave = (e, index: number) => {
  //   e.stopPropagation()
  //   e.preventDefault()
  //   const ref = featuresRefs.current[index]
  //   if (ref) {
  //     gsap.to(ref, {
  //       scale: initialCardStates[index].scale,
  //       y: initialCardStates[index].y,
  //       duration: 0.5,
  //       ease: "power2.out",
  //     })
  //   }
  // }

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
        paddingTop: 30,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "300px",
          height: "400px",
          perspective: "1000px",
          userSelect: "none",
          marginBottom: 8,
        }}
      >
        {featuresList.map((feature, index) => (
          <Box
            key={index}
            ref={(el: HTMLDivElement | null) =>
              (featuresRefs.current[index] = el)
            }
            onClick={(e) => {
              e.stopPropagation() // 防止事件冒泡到 Backdrop
              if (!feature.isButton) {
                handleCardClick(index)
              } else {
                // 对于按钮类型的卡片，处理点击事件
                handleEnter()
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
              // 移除 zIndex 这里的设置，改由动画控制
              // zIndex: feature.isButton ? featuresList.length + 1 : index,
              "&:hover": {
                boxShadow: isInitialAnimationComplete
                  ? "0 12px 48px rgba(0, 0, 0, 0.2)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
              },
              pointerEvents: isInitialAnimationComplete ? "auto" : "none",
              // 设置最小和最大缩放
              minWidth: feature.isButton ? "300px" : "200px",
              minHeight: feature.isButton ? "400px" : "250px",
              maxWidth: "80vw",
              maxHeight: "80vh",
              willChange: "transform, opacity", // 优化动画性能
            }}
          >
            {feature.isButton ? (
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation() // 防止事件冒泡
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
                <Typography
                  variant="h5"
                  sx={{ whiteSpace: "pre-line", fontSize: "1.5rem", mb: 1 }}
                >
                  {feature.icon} {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-line", opacity: 0.8 }}
                >
                  {feature.description}
                </Typography>
              </Button>
            ) : (
              <>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    pointerEvents: "auto",
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
                      whiteSpace: "pre-line",
                    }}
                  >
                    <span>{feature.icon}</span>
                    {feature.title}
                  </Typography>
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "center",
                      justifyContent: "center",
                      pb: "80px",
                    }}
                  >
                    <Typography
                      alignContent={"center"}
                      variant="body2"
                      sx={{ whiteSpace: "pre-line", opacity: 0.8 }}
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
