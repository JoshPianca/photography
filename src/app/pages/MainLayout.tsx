import {
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useEffect, useState } from "react";

export interface ImageDetails {
  thumbnailLink: string;
  downloadUrl: string;
  originalFilename: string;
}

export function MainLayout() {
  const apiKey = process.env.REACT_APP_API_KEY;
  const dirId = process.env.REACT_APP_DIR_ID;
  console.log(`debuglog ${apiKey} ${dirId}`);
  const [loading, setLoading] = useState(true);
  const [imgs, setImgs] = useState<ImageDetails[]>([]);
  const [selectedItem, setSelectedItem] = useState<ImageDetails | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await fetch(
      `https://www.googleapis.com/drive/v2/files?q=%27${dirId}%27+in+parents&key=${apiKey}`
    )
      .then((response) => response.json())
      .then((jsonResp) => {
        parseItems(jsonResp.items);
      });
  }

  const parseItems = (jsonResp: any) => {
    if (!jsonResp || !jsonResp.length) {
      return;
    }
    let items: ImageDetails[] = [];
    jsonResp.forEach((item: any) => {
      items.push({
        thumbnailLink: item.thumbnailLink,
        downloadUrl: item.downloadUrl,
        originalFilename: item.originalFilename,
      });
    });
    setLoading(false);
    setImgs(items);
  };

  const ModalViewer = (props: ModalViewerProps) => {
    const { image } = props;

    const handleClose = () => {
      setSelectedItem(null);
    };

    return (
      <Dialog onClose={handleClose} open={image !== null}>
        <DialogTitle>{image?.originalFilename}</DialogTitle>
        <img src={image?.downloadUrl} alt={image?.originalFilename} />
      </Dialog>
    );
  };

  return (
    <>
      <Grid container spacing={2} padding={2}>
        <Grid size={12}>
          <h1>Kieran White photography</h1>
        </Grid>
      </Grid>
      <Divider variant="inset" />
      <Grid container spacing={2} padding={2}>
        <Grid size={12}>
          {loading && <CircularProgress />}
          {!loading && (
            <ImageList variant="masonry" cols={4} gap={8}>
              {imgs.map((item) => (
                <ImageListItem
                  key={item.originalFilename}
                  onClick={() => 
                    setSelectedItem(item)
                  }
                >
                  <img
                    srcSet={`${item.downloadUrl},${item.thumbnailLink}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.thumbnailLink}?w=248&fit=crop&auto=format`}
                    alt={item.originalFilename}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Grid>
        <ModalViewer open={selectedItem !== null} image={selectedItem} />
      </Grid>
    </>
  );
}

export interface ModalViewerProps {
  open: boolean;
  image: ImageDetails | null;
}
