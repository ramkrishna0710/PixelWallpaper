import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_KEY } from '@env';
import { Dimensions } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const uri = `https://api.pexels.com/v1/search?query=mobile+wallpaper&orientation=portrait`;

type SearchPayload = {
    total_results: number;
    page: number;
    per_page: number;
    photos: Photo[];
};
type Photo = {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    photographer_id: string;
    avg_color: string;
    src: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
        portrait: string;
        landscape: string;
        tiny: string;
    };
    liked: boolean;
    alt: string;
};

const { width } = Dimensions.get('screen');
const _imageWidth = width * 0.7;
const _imageHeight = _imageWidth * 1.76;
const _spacing = 12;

function Photo({ item, index, scrollX }: { item: Photo, index: number, scrollX: SharedValue<number> }) {
    const stylez = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(scrollX.value,
                        [index - 1, index, index + 1],
                        [1.6, 1, 1.6]
                    )
                },
                {
                    rotate: `${interpolate(
                        scrollX.value,
                        [index - 1, index, index + 1],
                        [15, 1, -15]
                    )}deg`
                },
            ]
        }
    })
    return (
        <View
            style={{
                width: _imageWidth,
                height: _imageHeight,
                borderRadius: 16,
                overflow: 'hidden',
            }}
        >
            <Animated.Image
                source={{ uri: item.src.large }}
                style={[{ flex: 1 }, stylez]}
            />
        </View>
    )
}

function BackdropPhoto({
    photo,
    index, scrollX
}: {
    photo: Photo;
    index: number;
    scrollX: SharedValue<number>;
}) {
    const stylez = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollX.value,
                [index - 1, index, index + 1],
                [0, 1, 0]
            ),
        }
    })
    return (
        <Animated.Image
            source={{ uri: photo.src.large }}
            style={[StyleSheet.absoluteFillObject, stylez]}
            blurRadius={50}
        />
    )
}

const PixelWallpapers = () => {

    const { data, isLoading } = useQuery<SearchPayload>({
        queryKey: ['wallpapers'],
        queryFn: async () => {
            const res = await fetch(uri, {
                headers: {
                    Authorization: API_KEY,
                },
            }).then((res) => res.json());
            // console.log(res);
            return res;
        },
    });

    const scrollX = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((e) => {
        scrollX.value = e.contentOffset.x / (_imageWidth + _spacing)
    })

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={'black'} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={StyleSheet.absoluteFillObject}>
                {
                    data?.photos.map((photo, index) => (
                        <BackdropPhoto key={photo?.id} photo={photo} index={index} scrollX={scrollX} />
                    ))
                }
            </View>
            <Animated.FlatList
                data={data?.photos}
                keyExtractor={(item) => String(item.id)}
                horizontal
                style={{ flexGrow: 0 }}
                snapToInterval={_imageWidth + _spacing}
                decelerationRate={"fast"}
                contentContainerStyle={{
                    gap: _spacing,
                    paddingHorizontal: (width - _imageWidth) / 2,
                }}
                renderItem={({ item, index }) => {
                    return <Photo item={item} index={index} scrollX={scrollX} />;
                }}
                onScroll={onScroll}
                scrollEventThrottle={1000 / 60}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
};

export default PixelWallpapers;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
});
