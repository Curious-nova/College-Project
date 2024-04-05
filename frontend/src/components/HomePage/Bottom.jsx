import { Bottomcss } from './Bottomcss'
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const linkStyles = {
    color: 'inherit', // Inherit the color from the parent element
    textDecoration: 'none', // Remove underline
};

export const Bottom = () => {
    return (
        <Bottomcss>
            <div className="div4">
                <div className="fb">
                    <div className="onee">
                        <div><a href="https://www.facebook.com" style={linkStyles}><FacebookIcon /></a></div>
                        <div><a href="https://twitter.com" style={linkStyles}><TwitterIcon /></a></div>
                        <div><a href="https://www.instagram.com" style={linkStyles}><InstagramIcon /></a></div>
                    </div>
                    <div className="copy">
                        <p>© 2024 BookMyTrip PVT. LTD.</p>
                        <p>Country India</p>
                    </div>
                </div>
            </div>
        </Bottomcss>
    );
}
