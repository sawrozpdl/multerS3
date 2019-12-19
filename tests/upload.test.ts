import * as request from 'supertest';
import app from './../src/server';
import { getExtention, getFileName } from './../src/routes/upload.route';


it('uploads files successfully', async () => {

    let image: string = '/home/saroj/projects/web/ase/multerS3/tests/images/stockimage.jpg';

    await request(app)
        .post('/api/upload')
        .set('Content-type', 'multipart/form-data')
        .attach('userimage', image).then(result => {
            expect(result.body.image.split('.')[0]).toBe('stockimage');
        }).catch(error => {
            console.log(error);
        }); 
});


it('does not accept files other than images', async () => {

    let file: string = '/home/saroj/projects/web/ase/multerS3/tests/images/weird.file';

    await request(app)
        .post('/api/upload')
        .set('Content-type', 'multipart/form-data')
        .attach('userimage', file).then(result => {
            expect(result.body.error).toBe('Unsupported Image Format!');
        }).catch(error => {
            console.log(error);
        }); 
});

it('getExtention works', () => {
    expect(getExtention('something.txt')).toBe('txt');
})

it('getFilename works', () => {
    expect(getFileName('filey.png')).toBe('filey');
})