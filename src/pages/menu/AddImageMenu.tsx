import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { MenuApi } from '../../api/services/menu';

interface Props {
  imgUrl: null | string;
  name: string;
  itemId: string;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImageStyled = styled('img')({
  width: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const menuApi = new MenuApi();

function AddImageMenu(props: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>();
  const [changeImage, setChangeImage] = useState(false);
  const [rawFile, setRawFile] = useState<File>();

  useEffect(() => {
    setImageUrl(props.imgUrl);
  }, [props.imgUrl]);
  const handleNewImage = (newFile: File) => {
    setRawFile(newFile);
    setImageUrl(URL.createObjectURL(newFile));
    setChangeImage(true);
  };
  const handleClickSaveImage = () => {
    const formData = new FormData();
    if (!rawFile) return;
    formData.append('file', rawFile, rawFile?.name);

    // console.log(formData.getAll('image'));
    menuApi.updateImage(props.itemId, formData);
  };

  return (
    <>
      <Box sx={{ padding: '10px', marginTop: '10px' }}>
        <Box
          sx={{
            width: '400px',
            height: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {!imageUrl ? (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'grey',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography>Тут буде картинка для страви</Typography>
            </Box>
          ) : (
            <ImageStyled src={imageUrl} alt={`Image of ${props.name}`} />
          )}{' '}
        </Box>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ marginTop: '10px' }}
        >
          Завантажити зображення
          <VisuallyHiddenInput
            type="file"
            onChange={event => {
              const file = event.target.files?.[0];
              if (!file) return;
              handleNewImage(file);
            }}
          />
        </Button>
        {changeImage && (
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<SaveIcon />}
            sx={{ marginTop: '10px', marginLeft: '20px' }}
            onClick={handleClickSaveImage}
          >
            Зберегти збраження
          </Button>
        )}
      </Box>
    </>
  );
}

export default AddImageMenu;
