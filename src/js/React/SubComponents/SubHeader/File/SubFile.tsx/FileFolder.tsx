import * as React from "react"
import { useState, useEffect } from "react"
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import TextField from "@mui/material/TextField"

export default function RenamableSimpleTreeView() {
  const [editableItem, setEditableItem] = useState(null)
  const [items, setItems] = useState({
    1: "Applications",
    2: "Calendar",
    5: "Documents",
    10: "OSS",
    6: "MUI",
    8: "index.js",
  })

  const handleKeyDown = (event: any, itemId: any) => {
    if (event.key === "F2") {
      setEditableItem(itemId)
    }
  }

  const handleBlur = () => {
    setEditableItem(null)
  }

  const handleChange = (event: any, itemId: any) => {
    setItems({
      ...items,
      [itemId]: event.target.value,
    })
  }

  useEffect(() => {
    console.log(editableItem)
    const handleGlobalKeyDown = (event: any) => {
      if (event.key === "F2" && editableItem !== null) {
        setEditableItem(null)
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown)
    }
  }, [editableItem])

  return (
    <SimpleTreeView
      aria-label="file system navigator"
      sx={{ height: 200, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      <TextField
        value={items[1]}
        onChange={(event) => handleChange(event, "1")}
        onBlur={handleBlur}
        autoFocus
      />
      <TreeItem
        itemId="1"
        label={
          editableItem === "1" ? (
            <TextField
              value={items[1]}
              onChange={(event) => handleChange(event, "1")}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            items[1]
          )
        }
        onKeyDown={(event) => handleKeyDown(event, "1")}
      >
        <TreeItem
          itemId="2"
          label={
            editableItem === "2" ? (
              <TextField
                value={items[2]}
                onChange={(event) => handleChange(event, "2")}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              items[2]
            )
          }
          onKeyDown={(event) => handleKeyDown(event, "2")}
        />
      </TreeItem>
      <TreeItem
        itemId="5"
        label={
          editableItem === "5" ? (
            <TextField
              value={items[5]}
              onChange={(event) => handleChange(event, "5")}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            items[5]
          )
        }
        onKeyDown={(event) => handleKeyDown(event, "5")}
      >
        <TreeItem
          itemId="10"
          label={
            editableItem === "10" ? (
              <TextField
                value={items[10]}
                onChange={(event) => handleChange(event, "10")}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              items[10]
            )
          }
          onKeyDown={(event) => handleKeyDown(event, "10")}
        />
        <TreeItem
          itemId="6"
          label={
            editableItem === "6" ? (
              <TextField
                value={items[6]}
                onChange={(event) => handleChange(event, "6")}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              items[6]
            )
          }
          onKeyDown={(event) => handleKeyDown(event, "6")}
        >
          <TreeItem
            itemId="8"
            label={
              editableItem === "8" ? (
                <TextField
                  value={items[8]}
                  onChange={(event) => handleChange(event, "8")}
                  onBlur={handleBlur}
                  autoFocus
                />
              ) : (
                items[8]
              )
            }
            onKeyDown={(event) => handleKeyDown(event, "8")}
          />
        </TreeItem>
        
      </TreeItem>
    </SimpleTreeView>
  )
}
