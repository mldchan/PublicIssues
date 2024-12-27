/*
 * Public Issues allows creating issues on most repo software. Great for self hosts.
 * Copyright (C) 2024  エムエルディーちゃん mldchan
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *  
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export default function Metadata(props: {
    name: string;
    description: string;
    domain: string;
    author: string;
    siteName: string;
}) {
    return (
        <>
            <meta charSet="UTF-8"/>
            <title>{props.name}</title>
            <meta name="description" content={props.description}/>
            <meta name="author" content={`${props.author}`}/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta http-equiv="content-language" content="en"/>
            <meta property="og:title" content={`${props.name}`}/>
            <meta property="og:description" content={props.description}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`https://${props.domain}`}/>
            <meta property="og:site_name" content={`${props.siteName}`}/>
            <meta property="og:locale" content="en_US"/>
            <meta property="og:locale:alternate" content="ja_JP"/>
            <meta name="twitter:title" content={`${props.name}`}/>
            <meta name="twitter:description" content={props.description}/>
        </>
    )
}
