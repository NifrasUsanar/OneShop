import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Typography, Chip } from '@mui/material';

export default function ProductItem({ product }) {
    const { name, price, image_url, quantity } = product;
  return (
    <Card>
        
      <CardMedia
        sx={{ height: 120 }}
        image={'/storage/'+image_url}
        title={name}
      />
      <CardContent sx={{paddingBottom:'10px!important'}}>
        <Typography variant="subtitle1" component="div" className='text-center' sx={{lineHeight:'1.2rem'}}>
            {name} - ({quantity})
        </Typography>
        <div className='flex justify-center mt-1'>
            {/* <Chip label={price} color='primary' size='large' />
             */}
             <p className='font-extrabold'>{price}</p>
        </div>
      </CardContent>
    </Card>
  );
}
